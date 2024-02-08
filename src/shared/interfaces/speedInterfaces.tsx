interface userSpeedBookmarkInterface {
  bookmark_id: number;
  bookmar_category: string;
}

interface userSpeedFeedbackInterface {
  feedback_id: number;
  feedback_vote: number;
}

interface speedBaseInterface {
  description: string;
  estimated: boolean;
  is_public: boolean;
  kmph: number;
  name: string;
  speed_type: string;
  tags: Array<string>;
}

interface speedInterface extends speedBaseInterface {
  id: string & { isUUID: true };
  score: number;
  user: string;
  url: string;
  user_speed_bookmark: null | userSpeedBookmarkInterface;
  user_speed_feedback: null | userSpeedFeedbackInterface;
}

interface responseSpeedDataInterface {
  count: number;
  next: string;
  previous: string;
  results: Array<speedInterface>;
}

interface speedQueryParams {
  page: number;
  isPublic: null | boolean;
  userName: null | string | undefined;
  speedType: null | "top" | "average" | "constant" | "relative";
  speedTags: null | Array<string>;
}

export type {
  userSpeedBookmarkInterface,
  userSpeedFeedbackInterface,
  speedBaseInterface,
  speedInterface,
  responseSpeedDataInterface,
  speedQueryParams,
};
