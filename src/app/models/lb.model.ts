export interface SqlMessage {
  _rows: number;
  _next: string;
  _total: number;
}

export interface HaPartner {
  ip: string;
  role: string;
  status: string;
}

export interface Interface {
  enabled: boolean;
  id: string;
  mac: string;
  lacpmode: string;
}

export interface Ipaddress {
  dns: string[];
  enabled: boolean;
  ip: string;
  type: string;
}

export interface Route {
  gateway: string;
  mask: number;
  network: string;
}

export interface VrfContext {
  cloud_ref: string;
  name: string;
  routes: Route[];
  tenant_ref: string;
  uuid: string;
}

export interface Data {
  cluster_dns: string[];
  cluster_ip: string;
  device_id: string;
  firmware: string;
  ha_partner: HaPartner[];
  interfaces: Interface[];
  ipaddresses: Ipaddress[];
  mfr: string;
  model: string;
  product_code: number;
  serial: string;
  cluster_uuid: string;
  vrf_contexts: VrfContext[];
}

export interface DbRecord {
  data: Data;
  id: string;
  last_modified: Date;
  load_balancer_ip: string;
  _sql_message: SqlMessage;
  last_error?: string;
}

export interface LoadBalancer {
  sql_message: SqlMessage;
  db_records: DbRecord[];
}

export interface List {
  name: string;
  ip: string;
  mfr: string;
}

export interface Response {
  db_records: DbRecord[];
}

export interface Filter {
  Key: string;
  Value: string;
  Notes?: string;
}