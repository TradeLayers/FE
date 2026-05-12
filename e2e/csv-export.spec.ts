import { test, expect } from './fixtures';
import { openAccountTab } from './helpers/account';

test('export portfolio transactions as CSV', async ({ page, authedPage }) => {
    await authedPage;
    await openAccountTab(page, 'transactions');

    const downloadPromise = page.waitForEvent('download');
    await page.getByTestId('export-csv').click();
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toMatch(/transactions.*\.csv$/i);

    const stream = await download.createReadStream();
    const chunks: Buffer[] = [];
    if (stream) {
        for await (const chunk of stream) {
            chunks.push(chunk as Buffer);
        }
    }
    const body = Buffer.concat(chunks).toString('utf8');
    const [header, ...rows] = body.trim().split(/\r?\n/);
    expect(header).toMatch(/date.*type.*symbol.*quantity.*price.*total/i);
    if (rows.length > 0) {
        expect(rows[0].split(',')).toHaveLength(6);
    }
});
