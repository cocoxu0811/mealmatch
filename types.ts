export interface UserPreferences {
  taste: string[];
  allergies: string[];
  budget: string;
}

export interface UserPrivacySettings {
  favoriteListPublic: boolean;
  wantToTryListPublic: boolean;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  preferences?: UserPreferences;
  privacySettings?: UserPrivacySettings;
}

export enum RequestStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

export interface EventRequest {
  id: string;
  user: User;
  status: RequestStatus;
  timestamp: Date;
}

export interface DiningEvent {
  id: string;
  host: User;
  title: string;
  description: string;
  cuisine: string;
  date: Date;
  location: string;
  spotsTotal: number;
  spotsFilled: number;
  image: string;
  tags: string[];
  participants: User[];
  requests: EventRequest[];
}

export interface ChatThread {
  id: string;
  user: User;
  lastMessage: string;
  timestamp: Date;
  unread: number;
}

export const CUISINES = [
  'Hot Pot', 'Sushi', 'BBQ', 'Italian', 'Burgers', 'Chinese', 'Thai', 'Dessert', 'Brunch', 'Other'
];