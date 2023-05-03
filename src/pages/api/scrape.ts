import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import cheerio from 'cheerio';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { url } = req.query;

  try {
    const response = await axios.get(url as string);
    const html = response.data;
    const $ = cheerio.load(html);
    let articleText = '';

    $('h1, h2, h3, h4, h5, h6, p, ul, ol').each((i, el) => {
      const tag = $(el).get(0).tagName.toLowerCase();
      switch (tag) {
        case 'h1':
          articleText += `# ${$(el).text()}\n\n`;
          break;
        case 'h2':
          articleText += `## ${$(el).text()}\n\n`;
          break;
        case 'h3':
          articleText += `### ${$(el).text()}\n\n`;
          break;
        case 'h4':
          articleText += `#### ${$(el).text()}\n\n`;
          break;
        case 'h5':
          articleText += `##### ${$(el).text()}\n\n`;
          break;
        case 'h6':
          articleText += `###### ${$(el).text()}\n\n`;
          break;
        case 'p':
          articleText += `${$(el).text()}\n\n`;
          break;
        case 'ul':
          $(el)
            .find('li')
            .each((i, li) => {
              articleText += `- ${$(li).text()}\n`;
            });
          articleText += '\n';
          break;
        case 'ol':
          $(el)
            .find('li')
            .each((i, li) => {
              articleText += `${i + 1}. ${$(li).text()}\n`;
            });
          articleText += '\n';
          break;
        default:
          break;
      }
    });

    res.status(200).json({ data: articleText });
  } catch (error) {
    res.status(500).json({ error: 'Data was unable to be fetched.' });
  }
};