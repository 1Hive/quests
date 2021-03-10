import env from '../environment'

const Airtable = require('airtable')

Airtable.configure({
  endpointUrl: 'https://api.airtable.com',
  apiKey: env('AIRTABLE_KEY'),
})

const base = Airtable.base('appoEtN1RpO4eniQJ')

export function writeAirtableData(party, chainId, data) {
  data.map((user) =>
    base('data').create(
      [
        {
          fields: {
            id: `${party}:${chainId}:${user.account}`,
            account: user.account,
            amount: user.amount,
          },
        },
      ],
      function (err, records) {
        if (err) {
          console.error(err)
          return
        }
        records.forEach(function (record) {
          console.log(record.getId())
        })
      }
    )
  )
}

export function readAirtableAmount(party, chainId, account) {
  base('data')
    .select({
      // Selecting the first 3 records in Grid view:
      maxRecords: 1,
      view: 'Grid view',
      fields: ['id', 'amount'],
      filterByFormula: `id = '${party}:${chainId}:${account}'`,
    })
    .firstPage(
      function page(records) {
        return records[0].get('amount')
      },
      function done(err) {
        if (err) {
          console.error(err)
        }
      }
    )
}
