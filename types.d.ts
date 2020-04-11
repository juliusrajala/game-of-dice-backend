// Domain related types.

declare type DieType =
  | 'd2'
  | 'd3'
  | 'd4'
  | 'd6'
  | 'd8'
  | 'd10'
  | 'd12'
  | 'd20'
  | 'd100';

declare type EventType = 'dice_event' | 'hp_event' | '';

declare interface Die {
  id: string;
  type: DieType;
  value: number | null;
}

declare interface User {
  user_email: string;
  user_name: string;
  user_id: string;
  accent_color: string;
}

declare interface DndEvent {
  event_type: EventType;
  event_id: string;
  creator: string;
  timestamp: number;
  description: string;
}

declare interface DiceEvent extends DndEvent {
  event_type: 'dice_event';
  rolls: Die[];
  skill?: string;
}

declare interface HpEvent extends DndEvent {
  event_type: 'hp_event';
  target: string;
  value: number;
  type: 'spell' | 'elemental' | 'non-lethal' | 'trap';
}

declare interface Character {
  id: string;
  name: string;
  hp: number;
  ac: number;
  attackBonus: number;
  damageTaken: number;
}
