import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface VideoEntry {
    id: string;
    title: string;
    description?: string;
    videoBlob: ExternalBlob;
    bibleReference?: string;
    uploadDate: bigint;
    uploadedBy: Principal;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addVideoEntry(id: string, title: string, description: string | null, bibleReference: string | null, videoBlob: ExternalBlob): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteVideoEntry(videoId: string): Promise<void>;
    getAllVideos(): Promise<Array<VideoEntry>>;
    getCallerUserRole(): Promise<UserRole>;
    getVideo(id: string): Promise<VideoEntry | null>;
    isCallerAdmin(): Promise<boolean>;
}
