/**
 * useGatewaySync
 *
 * Subscribes to the Supabase Realtime `gateway-sync` channel.
 * The local must-b Gateway (CLI) can join the same channel using the
 * Supabase JS client with the project's anon key and receive these events
 * in real time, keeping auth state in sync without polling.
 *
 * Gateway-side usage (Node.js):
 *   const { createClient } = require('@supabase/supabase-js')
 *   const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
 *   supabase.channel('gateway-sync')
 *     .on('broadcast', { event: 'auth' }, ({ payload }) => {
 *       // payload: { event: 'SIGNED_IN'|'SIGNED_OUT', uid, user_id, email }
 *       handleAuthChange(payload)
 *     })
 *     .subscribe()
 */

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { Session } from "@supabase/supabase-js";

interface GatewayAuthPayload {
  event: "SIGNED_IN" | "SIGNED_OUT";
  user_id: string | null;
  email:   string | null;
  /** MUSTB_UID if stored in user_metadata, otherwise null */
  uid:     string | null;
}

/**
 * Call this hook anywhere you want gateway sync to be active
 * (e.g. Dashboard, AuthConnect).  It cleans up automatically on unmount.
 */
export function useGatewaySync() {
  useEffect(() => {
    const channel = supabase.channel("gateway-sync");

    // Broadcast current auth state when this hook mounts
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        broadcastAuth(channel, "SIGNED_IN", session);
      }
    });

    // Re-broadcast on any future auth state change
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN" && session) {
          broadcastAuth(channel, "SIGNED_IN", session);
        } else if (event === "SIGNED_OUT") {
          broadcastAuth(channel, "SIGNED_OUT", null);
        }
      }
    );

    channel.subscribe();

    return () => {
      subscription.unsubscribe();
      supabase.removeChannel(channel);
    };
  }, []);
}

function broadcastAuth(
  channel: ReturnType<typeof supabase.channel>,
  event: GatewayAuthPayload["event"],
  session: Session | null
) {
  const payload: GatewayAuthPayload = {
    event,
    user_id: session?.user.id   ?? null,
    email:   session?.user.email ?? null,
    uid:     (session?.user.user_metadata?.mustb_uid as string) ?? null,
  };
  channel.send({ type: "broadcast", event: "auth", payload });
}
