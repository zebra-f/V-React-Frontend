interface userSpeedBookmarkInterface {
  bookmark_id: number;
  bookmar_category: string;
}
interface userSpeedFeedbackInterface {
  feedback_id: number;
  feedback_vote: number;
}
interface speedInterface {
  description: string;
  estimated: boolean;
  id: string & { isUUID: true };
  is_public: boolean;
  kmph: number;
  name: string;
  score: number;
  speed_type: string;
  tags: Array<string>;
  url: string;
  user: string;
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
  userName: null | string;
  speedType: null | "top" | "average" | "constant" | "relative";
  speedTags: null | Array<string>;
}

export type {
  userSpeedBookmarkInterface,
  userSpeedFeedbackInterface,
  speedInterface,
  responseSpeedDataInterface,
  speedQueryParams,
};
