export interface CopyButtonVisibility {
  _id: string;
  platformId: string;
  planId: string;
  isVisible: boolean;
  updatedAt: string;
}

export interface PlanVisibilitySettings {
  planId: string;
  isVisible: boolean;
  updatedAt: string;
}

export interface GlobalVisibilitySettings {
  isVisible: boolean;
  updatedAt: string;
}

export interface CopyButtonVisibilityState {
  platformVisibility: CopyButtonVisibility[];
  planVisibility: PlanVisibilitySettings[];
  globalVisibility: GlobalVisibilitySettings;
}