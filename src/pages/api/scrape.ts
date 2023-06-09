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

    // Check for article or main content tags
    const mainContent = $('article, main, .content, .article').first();
    const contentElement = mainContent.length ? mainContent : $('body');

    contentElement.find('h1, h2, h3, h4, h5, h6, p, ul, ol').each((i, el) => {
      // Exclude unwanted elements
      if ($(el).closest('.comments, .ads, .sidebar, script').length) {
        return;
      }

      const tag = $(el).get(0).tagName.toLowerCase();
      const text = $(el).text().trim();

      // Check the text length
      if (text.length < 10) {
        return;
      }
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