import {
  amazonIcon,
  crunchyrollIcon,
  funimationIcon,
  huluIcon,
  netflixIcon,
  tubiIcon,
} from "@/assets";

interface StreamingLogo {
  icon: string;
  streamer: string;
}

export const streamingLogos: StreamingLogo[] = [
  {
    icon: amazonIcon,
    streamer: "amazon",
  },
  {
    icon: crunchyrollIcon,
    streamer: "crunchyroll",
  },
  {
    icon: funimationIcon,
    streamer: "funimation",
  },
  {
    icon: huluIcon,
    streamer: "hulu",
  },
  {
    icon: tubiIcon,
    streamer: "tubi",
  },
  {
    icon: netflixIcon,
    streamer: "netflix",
  },
];
