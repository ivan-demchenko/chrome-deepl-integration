export type GetClickedElementMsg = { type: "get-clicked-element" };

export type GetClickedElementMsgResponse = {
  value: string;
};

export type SetClickedElementValueMsg = {
  type: "set-clicked-element-value";
  newValue: string;
};

export type SetClickedElementValueMsgResponse = {
  done: true;
};

export type TabMessagePayload =
  | GetClickedElementMsg
  | SetClickedElementValueMsg;
