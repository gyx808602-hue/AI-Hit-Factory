import type { PageQuery } from "../../shared/types";

export interface ConfigPageQuery extends PageQuery {
  keywords?: string;
}

export interface ConfigItem {
  id: number;
  configName: string;
  configKey: string;
  configValue: string;
  remark?: string;
}

export interface ConfigForm {
  id?: number;
  configName: string;
  configKey: string;
  configValue: string;
  remark?: string;
}
