export type RideState =
  | "requested"
  | "searching"
  | "queued"
  | "assigned"
  | "on_way"
  | "arrived"
  | "in_progress"
  | "completed"
  | "cancelled";

export const rideTransitions: Record<RideState, RideState[]> = {
  requested: ["searching", "queued"],
  searching: ["assigned", "cancelled"],
  queued: ["assigned", "cancelled"],
  assigned: ["on_way"],
  on_way: ["arrived"],
  arrived: ["in_progress"],
  in_progress: ["completed"],
  completed: [],
  cancelled: [],
};
