// Duration types
export type DurationType = "minutes" | "hours" | "days" | "weeks" | "months" | "years";

export interface Plan {
    _id: string;
    name: string;
    description: string;
    price: number;
    platforms: string[];
    PlanBenefits: string[];
    stickerText?: string;
    stickerColor?: string;
    durationType: DurationType;
    durationValue: number;
    showOnHomepage: boolean;
    homepageOrder: number;
    slug: string;
    isDraft: boolean;
    createdAt: string;
    updatedAt: string;
}
