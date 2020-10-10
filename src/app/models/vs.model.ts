export interface SqlMessage {
    _next?: string;
    _rows?: number;
    _total?: number;
}

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
    obj_name?: string;
    timeout?:number;
    description?:string;

}

export interface Pool {
    _service_type?: string;
    _status?: string;
    _uuid?: string;
    bindings: Binding[];
    certificate?: Certificate;
    default_port?: number;
    enabled: boolean;
    priority?: number;
    weight?: number;
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
    _last_30?: number;
}

export interface DbRecord {
    _load_balancer?: LoadBalancer;
    data: Data;
    id?: string;
    platform?: string;
    _source_status?: string;
    last_error?: string;
    last_modified?: Date;
    load_balancer_ip?: string;
}

export interface LoadBalancer {
    dns?: string[];
    mfr?: string;
}

export interface VirtualService {
    db_records?: DbRecord[];
    sql_message?: SqlMessage;
}

export interface Response {
    db_records?: DbRecord[];
}

export interface Filter {
    Key: string;
    Value: string;
    Notes?: string;
}