import type { Dayjs } from "dayjs";
import type { ComponentType, ReactNode } from "react";

// ─── API & Webhooks ────────────────────────────────────────────────

export interface ApiConfig {
    readonly webhookBase: string;
    readonly humsBase: string;
    readonly spotifyApiBase: string;
    readonly spotifyAuthEndpoint: string;
    readonly spotifyTokenEndpoint: string;
    readonly spotifyClientId: string;
    readonly spotifyScope: string;
}

// ─── Time & Hours ──────────────────────────────────────────────────

export interface HumsScheduleRange {
    start: string;
    end: string;
}

export interface HumsScheduleDay {
    dayOfWeek: number;
    ranges: HumsScheduleRange[];
}

export interface HumsException {
    start: string;
    end: string;
}

export interface HumsPeriod {
    periodStart: string;
    periodEnd: string;
    schedule: HumsScheduleDay[];
    exceptions: HumsException[];
}

export interface HumsResponse {
    data: {
        periods: HumsPeriod[];
    };
}

export interface HoursState {
    openToday: boolean;
    hours: [string, string] | [];
}

export interface OpenState {
    openNow: boolean;
    openToday: boolean;
    hours?: [Dayjs, Dayjs];
}

export type TimeHelperTuple = [string, string, Dayjs | string, Dayjs | string];

export interface AlertBullet {
    icon: ComponentType<Record<string, unknown>>;
    text: string;
}

export interface AlertContent {
    title: string;
    icon: ComponentType<Record<string, unknown>>;
    text?: string;
    bullets?: AlertBullet[];
}

export interface ScheduledAlert {
    start: Dayjs;
    end: Dayjs;
    type: AlertType;
    chime: string;
    id: string;
}

export type AlertType = "hourly" | "opened" | "closingSoon" | "openingSoon" | "closed";

export interface TimeContextValue {
    time: [string, string];
    date: string;
    openState: OpenState;
    hours: HoursState;
    alertActive: boolean;
    alertContent: AlertContent | null;
    timeHelper: TimeHelperTuple;
}

// ─── Events & Workshops ────────────────────────────────────────────

export interface WorkshopEvent {
    Name: string;
    Date: string;
    "End Date": string;
    Description?: string;
    "Remaining Slots": number;
    "# Waitlist": number;
    "Preview - Ticker"?: Array<{ url: string }>;
    "Publish Date"?: string;
}

export interface EventsContextValue {
    events: WorkshopEvent[];
    eventsToday: WorkshopEvent[];
    activeEvent: WorkshopEvent | undefined;
}

// ─── Spotify ───────────────────────────────────────────────────────

export interface SpotifyToken {
    access_token: string | null;
    refresh_token: string | null;
    expires_in: number | null;
    expires: string | null;
}

export interface SpotifyTokenResponse {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    error?: string;
}

export interface SpotifyArtist {
    name: string;
}

export interface SpotifyAlbumImage {
    url: string;
    height: number;
    width: number;
}

export interface SpotifyAlbum {
    images: SpotifyAlbumImage[];
}

export interface SpotifyTrack {
    id: string;
    name: string;
    artists: SpotifyArtist[];
    album: SpotifyAlbum;
}

export interface SpotifyPlayerState {
    is_playing: boolean;
    item: SpotifyTrack;
}

export interface SpotifyContextValue {
    currentToken: SpotifyToken;
    redirectToSpotifyAuthorize: () => void;
    request: (endpoint: string) => Promise<unknown>;
    logOut: () => void;
    playerState: SpotifyPlayerState | null;
    spotifyEnabled: boolean;
    setSpotifyEnabled: (value: boolean) => void;
}

// ─── Theme ─────────────────────────────────────────────────────────

export type ColorTheme = "light" | "dark";

export interface ThemeContextValue {
    colorTheme: ColorTheme;
    toggleColorTheme: () => void;
}

// ─── Slides ────────────────────────────────────────────────────────

export interface RawSlide {
    Title: string;
    Content: string;
    Enabled: boolean;
}

export interface Slide {
    title: string;
    content: string;
    enabled: boolean;
}

// ─── Printers ──────────────────────────────────────────────────────

export interface PrinterGroup {
    printerModel: string;
    printerType: string;
    printerCount: number;
    printerMaterial?: string;
    activeJobCount: number;
    queuedJobCount: number;
    logo?: string;
}

export interface PrinterQueueData {
    printers: PrinterGroup[];
}

// ─── FrontDesk Slides ──────────────────────────────────────────────

export interface FrontDeskSlide {
    component: ReactNode;
    skipIfClosed: boolean;
    skip?: boolean;
}
