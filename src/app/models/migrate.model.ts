export interface Server {
  _dns?: string[];
  _uuid?: string;
  ip?: string;
}

export interface Binding {
  enabled: boolean;
  graceful_disable?: boolean;
  port?: number;
  server: Server;
}

export interface Key {
  _algorithm?: string;
  _rsa_size?: string;
  pass_phrase?: string;
  private_key?: string;
}

export interface Certificate {
  _common_name?: string;
  _distinguished_name?: string;
  _expiry?: string;
  _self_signed?: boolean;
  _serial_number?: string;
  _signature_algorithm?: string;
  _uuid?: string;
  certificate?: string;
  key?: Key;
  name?: string;
}

export interface HealthMonitor {
  _uuid?: string;
  monitor_port?: number;
  name?: string;
  receive_timeout: number;
  request?: string;
  response_codes?: string[];
  response?: string;
  send_interval: number;
  successful_count: number;
  type: string;
}

export interface Persistence {
  _uuid?: string;
  name?: string;
  type?: string;
}

export interface Pool {
  _service_type?: string;
  _status?: string;
  _uuid?: string;
  bindings: Binding[];
  certificate?: Certificate;
  default_port?: number;
  enabled: boolean;
  graceful_disable?: boolean;
  health_monitors?: HealthMonitor[];
  is_nsr_service?: boolean;
  name?: string;
  persistence?: Persistence;
  ssl_enabled: boolean;
}

export interface Port {
  l4_profile?: string;
  port?: number;
  ssl_enabled: boolean;
}

export interface Data {
  _nsr_backup_vip?: string;
  _status?: string;
  _uuid?: string;
  certificates?: Certificate[];
  dns?: string[];
  enabled: boolean;
  ip?: string;
  load_balancing_method: string;
  name?: string;
  pools: Pool[];
  ports: Port[];
  product_code?: number;
  service_type?: string;
}

export interface DbRecord {
  _load_balancer?: LoadBalancer;
  data: Data;
  id?: string;
  platform?: string;
  last_error?: string;
  last_modified?: Date;
  load_balancer_ip?: string;
}

export interface LoadBalancer {
  dns?: string[];
  mfr?: string;
}

export interface Source {
  data: Data;
}

export interface Destination {
  data: Data;
}

export interface HealthStatus {
  type: string;
  ready: boolean;
  error: string;
}

export interface ServerStatus {
  ip: string;
  ready: boolean;
  error: string;
}

export interface PoolStatus {
  ready: boolean;
  health_monitors: HealthStatus[];
  persistence: boolean;
  servers: ServerStatus[];
  error: string;
}

export interface ReadinessChecks {
  ready: boolean;
  dependency_status: DependencyStatus;
  ip_status: IPStatus;
  network_status: NetworkStatus;
  pool_status: PoolStatus[];
  load_balancer: boolean;
  error: string;
}

export interface DependencyStatus{
ready: boolean;
error: string;
ips?: string[];
}

export interface IPStatus{
  ip: string;
  ready: boolean;
  error: string;
  }
  

export interface NetworkStatus{
port: number;
ready: string;
service_type: string;
error: string;
}

export interface MigrateData {
  source_id: string;
  product_code: number;
  source: Source;
  destination?: Destination;
  target_load_balancer?: string;
  source_load_balancer?: string;
  platform?: string;
  readiness_checks?: ReadinessChecks;
}

export interface RootObject {
  data?: MigrateData,
  _load_balancer?: LoadBalancer;
  id?: string;
  platform?: string;
  _source_status?: string;
  last_error?: string;
  last_modified?: Date;
  load_balancer_ip?: string;
}

export interface Request {
  product_code: number;
}