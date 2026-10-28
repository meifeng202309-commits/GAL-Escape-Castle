export function createAssetResolver(rpc,{ttlMs=30000,now=Date.now}={}){
  const cache=new Map();
  return {
    async resolve(assetKey){
      const cached=cache.get(assetKey),time=now();
      if(cached&&cached.expiresAt>time)return cached.value;
      const value=await rpc("asset_resolve",{p_asset_key:assetKey}).catch(()=>null);
      cache.set(assetKey,{value,expiresAt:time+ttlMs});
      return value;
    },
    async reportActiveLoadFailure(asset){
      if(!asset?.ok||!asset.version||!asset.storage_path)return null;
      return rpc("asset_report_load_failure",{
        p_asset_key:asset.asset_key,p_version:asset.version,p_storage_path:asset.storage_path,
      }).catch(()=>null);
    },
  };
}
