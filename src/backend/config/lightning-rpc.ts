export const lightningRpcConfig = {
  host: String(process.env.LND_HOST),
  port: String(process.env.LND_PORT),
  rpcProtoPath: String(process.env.LND_RPC_PROTO_PATH),
  certPath: String(process.env.LND_CERT_PATH),
  macaroonPath: String(process.env.LND_MACAROON_PATH),
  // options: {
  // 'grpc.lb_policy_name': 'round_robin',
  // 'grpc.so_reuseport': 1,
  // 'grpc.use_local_subchannel_pool': 1,
  // },
};
