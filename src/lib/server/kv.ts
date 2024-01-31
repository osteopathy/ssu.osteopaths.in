import { Redis } from '@upstash/redis';
import * as env from '$env/static/private';

const upstashClient = new Redis({
	url: env.UPSTASH_URL,
	token: env.UPSTASH_TOKEN
});

export const doesUsernameExist = async (username:string) => {
	try {
		const result = await upstashClient.exists(`username:${username}`);
		return result === 1;
	} catch (error) {
		console.log(error)
	}
	return false;
}

export const getOsteopathIdByUsername = async (username:string) => {
	try {
		return await upstashClient.hget(`username:${username}`,'osteopathId') as string
	} catch (error) {
		console.log(error)
	}
	return null
}

export const getUserIdByUsername = async (username:string) => {
	try {
		return await upstashClient.hget(`username:${username}`,'userId') as string
	} catch (error) {
		console.log(error)
	}
	return null
}

export const createUsername = async (
	username: string,
	osteopathId: string,
	userId: string,
) => {
	try {
		return await upstashClient.hset(`username:${username}`, {
			osteopathId,
			userId
		});
	} catch (error) {
		console.error(error);
	}
	return null;
};

export const changeUsername = async (
	oldUsername: string,
	username: string,
	osteopathId: string,
	userId: string,
) => {
	try {
		const result = await upstashClient.hget(`username:${oldUsername}`,'userId');
		if(result === userId) {
			const del = await upstashClient.hdel(`username:${oldUsername}`)
			return await upstashClient.hset(`username:${username}`, {
				osteopathId,
				userId
			});
		}
	} catch (error) {
		console.error(error);
	}
	return null;
};


export const getGoogleTokens = async (userId: string) => {
	try {
		return (await upstashClient.hmget(`token:${userId}`, 'access_token', 'refersh_token')) as {
			access_token: string;
			refersh_token: string | null;
		};
	} catch (error) {
		console.error(error);
	}
	return null;
};

export const setGoogleTokens = async (
	userId: string,
	tokens: {
		access_token: string;
		refersh_token: string | null;
	}
) => {
	try {
		return await upstashClient.hmset(`token:${userId}`, tokens);
	} catch (error) {
		console.error(error);
	}
	return null;
};

export default upstashClient;
