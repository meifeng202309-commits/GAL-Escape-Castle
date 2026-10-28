export function createAssetResolver(rpc,{ttlMs=30000,now=Date.now}={}){
  const cache=new Map(),inFlight=new Map();
  return {
    async resolve(assetKey){
      const cached=cache.get(assetKey),time=now();
      if(cached&&cached.expiresAt>time)return cached.value;
      if(inFlight.has(assetKey))return inFlight.get(assetKey);
      const pending=rpc("asset_resolve",{p_asset_key:assetKey}).catch(()=>null).then(value=>{
        if(value?.ok)cache.set(assetKey,{value,expiresAt:now()+ttlMs});
        return value;
      }).finally(()=>inFlight.delete(assetKey));
      inFlight.set(assetKey,pending);
      return pending;
    },
    async reportActiveLoadFailure(asset){
      if(!asset?.ok||!asset.version||!asset.storage_path)return null;
      return rpc("asset_report_load_failure",{
        p_asset_key:asset.asset_key,p_version:asset.version,p_storage_path:asset.storage_path,
      }).catch(()=>null);
    },
  };
}
