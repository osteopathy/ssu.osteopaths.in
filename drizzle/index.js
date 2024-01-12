import { createClient } from '@libsql/client/web';

// based on the email we need to check if the user is from osteopathy department of Sri Sri University
export function parseSSUEmail(email) {
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

export function isOsteopath(email) {
	const details = parseSSUEmail(email);
	if (email === 'peadevp@gmail.com') return 'bos';
	if (details?.batch === 'ios' || details?.batch === 'bos' || details?.batch === 'mos')
		return details?.batch;

	return false;
}

export const client = createClient({ url: DATABASE_URL, authToken: DATABASE_AUTH_TOKEN });
/**
 * @type {{id:string;gmail:string}[]}
 */
const users = (await client.execute('Select * from user;')).rows;

console.log(users);

// const requests = [];

// for (let index = 0; index < users.length; index++) {
// 	const user = users[index];
// 	const gmail = user.gmail;
// 	const osteopath = isOsteopath(gmail);
// 	if (osteopath) {
// 		requests.push(
// 			client.execute({
// 				sql: 'UPDATE user SET role="osteopath" WHERE id = $id;',
// 				args: { id: user.id }
// 			})
// 		);
// 	}
// }

// const res = await Promise.allSettled(requests);

// console.dir(res, {
// 	depth: Infinity
// });
