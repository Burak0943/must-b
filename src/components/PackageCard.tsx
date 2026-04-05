import { Package, Download, Star } from 'lucide-react';

export default function PackageCard({ pkg }: { pkg: any }) {
  return (
    <div className="bg-[#111] border border-white/10 p-5 rounded-xl hover:border-cyan-500/50 transition-all group">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-cyan-500/10 rounded-lg text-cyan-400">
          <Package size={24} />
        </div>
        <div className="flex items-center gap-1 text-xs text-yellow-500">
          <Star size={14} fill="currentColor" />
          {pkg.stars?.toLocaleString()}
        </div>
      </div>
      
      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
        {pkg.name}
      </h3>
      
      <p className="text-sm text-gray-400 line-clamp-2 mb-4 h-10">
        {pkg.summary}
      </p>
      
      <div className="flex items-center justify-between pt-4 border-t border-white/5">
        <span className="text-xs font-mono text-gray-500">{pkg.version}</span>
        <div className="flex items-center gap-2 text-xs text-gray-300">
          <Download size={14} />
          {pkg.downloads?.toLocaleString()}
        </div>
      </div>
    </div>
  );
}