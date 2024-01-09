// based on the email we need to check if the user is from osteopathy department of Sri Sri University
export function parseSSUEmail(email: string) {
  let group;
  if (!(typeof email === 'string')) return;
  const regrex = /(?<name>\w+)\.(?<meta>\w+)@(?<university>\w+)\.edu\.in/;
  group = email.match(regrex)?.groups;
  if (!group) return;
  const { name, meta } = group;
  const reg = /(?:[a-zA-Z])+(?<year>\d{4})(?<batch>(?:[a-zA-Z])+)/;
  group = meta.match(reg)?.groups;
  if (!group) return;
  const { year, batch } = group;
  return { name, meta, year: +year, batch };
}

export function isOsteopath(email: string): 'bos' | 'mos' | 'ios' | false {
  const details = parseSSUEmail(email)
  if (details?.batch === 'ios' || details?.batch === 'bos' || details?.batch === 'mos')
    return details?.batch
  return false
}
