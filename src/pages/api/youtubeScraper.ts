import type { NextApiRequest, NextApiResponse } from 'next';
import Api from 'youtube-browser-api';

async function fetchVideoTranscript(videoId: string) {
  try {
    const transcript = await Api.transcript({ videoId });

    if (Array.isArray(transcript.videoId)) {
      // Combine all the text properties from the transcript array
      const combinedText = transcript.videoId.map((item) => item.text).join(' ');
      return combinedText;
    } else {
      throw new Error('Transcript array not found');
    }
  } catch (error) {
    console.error(error);
    return '';
  }
}

async function fetchVideoTitle(videoId: string) {
  try {
    const titleData = await Api.content({
      id: videoId,
      params: ['title'],
    });

    return titleData.title;
  } catch (error) {
    console.error(error);
    return '';
  }
}

function extractVideoId(url: string) {
  const regex = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

export async function scrapeYoutube(url: string) {
  const videoId = extractVideoId(url);
  if (!videoId) {
    throw new Error('Invalid YouTube URL');
  }

  const title = await fetchVideoTitle(videoId);
  const formattedTitle = `## ${title}`;
  const transcript = await fetchVideoTranscript(videoId);

  return `${formattedTitle}\n\n${transcript}`;
}
