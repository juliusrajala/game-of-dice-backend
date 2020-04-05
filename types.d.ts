// Technical

declare interface SocketRoom {}

// Domain related types.

declare type DieType =
  | 'd2'
  | 'd4'
  | 'd6'
  | 'd8'
  | 'd10'
  | 'd12'
  | 'd20'
  | 'd100';

declare type EvenType = 'dice_event' | 'hp_event' | '';

declare interface Die {
  id: string;
  type: DieType;
  value: number | null;
}

declare interface DndEvent {
  event_type: 'dice' | 'hp';
  event_id: string;
  creator: string;
  timestamp: number;
  description: string;
}

declare interface DiceEvent extends DndEvent {
  event_type: 'dice';
  rolls: Die[];
  skill?: string;
}

declare interface HpEvent extends DndEvent {
  event_type: 'hp';
  target: string;
  value: number;
  damage_type: 'spell' | 'elemental' | 'non-lethal' | 'trap';
}
