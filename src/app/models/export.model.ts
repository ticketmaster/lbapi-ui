
export interface ExportVS {
   product_code: number;
   load_balancer_ip: string;
   ip: string;
   port: string;
   name: string;
   service: string;
   enabled: boolean;
   _last_30: number;
}

export interface ExportLB {
   product_code: number;
   cluster_dns: string;
   ip: string;
   mfr: string;
   model: string;
}