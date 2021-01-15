type HMTTrackPageview = ['_trackPageview', string];
type HMTTrackEvent = ['_trackEvent', string, string?, number?];
interface HMT {
  id: number;
  push: (arg: HMTTrackPageview | HMTTrackEvent) => void;
}

interface Window {
  routerBaseUrl: string;
  _hmt: HMT;
}
