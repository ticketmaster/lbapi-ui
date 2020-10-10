export interface SqlMessage {
    _rows: number;
}

export interface VsDbRecord {
    name: string;
    ip: string;
    load_balancer_ip: string;
    service_type: string;
}

export interface RootObject {
    sql_message: SqlMessage;
    vs_db_records: VsDbRecord[];
}