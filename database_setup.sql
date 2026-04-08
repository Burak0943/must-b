-- CREATE TABLES
CREATE TABLE IF NOT EXISTS agents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  status TEXT NOT NULL,
  memory_usage TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id UUID REFERENCES agents ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ENABLE ROW LEVEL SECURITY
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- CREATE POLICIES FOR AGENTS (Sızdırmazlık Kalkanları)
CREATE POLICY "Users can view their own agents" 
  ON agents FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own agents" 
  ON agents FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own agents" 
  ON agents FOR UPDATE 
  USING (auth.uid() = user_id) 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own agents" 
  ON agents FOR DELETE 
  USING (auth.uid() = user_id);

-- CREATE POLICIES FOR TASKS (Sızdırmazlık Kalkanları)
CREATE POLICY "Users can view their own tasks" 
  ON tasks FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tasks" 
  ON tasks FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks" 
  ON tasks FOR UPDATE 
  USING (auth.uid() = user_id) 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tasks" 
  ON tasks FOR DELETE 
  USING (auth.uid() = user_id);

-- CREATE STORAGE BUCKET FOR VECTOR VAULT
INSERT INTO storage.buckets (id, name, public) VALUES ('vault_files', 'vault_files', false) ON CONFLICT DO NOTHING;

-- ENABLE RLS ON STORAGE
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- CREATE POLICIES FOR VAULT FILES (Sızdırmazlık Kalkanları)
CREATE POLICY "Users can upload their own vault files" 
  ON storage.objects FOR INSERT 
  WITH CHECK (bucket_id = 'vault_files' AND auth.uid() = owner);

CREATE POLICY "Users can view their own vault files" 
  ON storage.objects FOR SELECT 
  USING (bucket_id = 'vault_files' AND auth.uid() = owner);

CREATE POLICY "Users can delete their own vault files" 
  ON storage.objects FOR DELETE 
  USING (bucket_id = 'vault_files' AND auth.uid() = owner);
