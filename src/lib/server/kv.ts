import { Redis } from '@upstash/redis';
import * as env from '$env/static/private';

const upstashClient = new Redis({
	url: env.UPSTASH_URL,
	token: env.UPSTASH_TOKEN
});

export const doesUsernameExist = async (username: string) => {
	const result = await upstashClient.exists(`username:${username}`);
	return result === 1;
}

export const getOsteopathIdByUsername = async (username: string) => {
	return await upstashClient.hget(`username:${username}`, 'osteopathId') as string
}

export const getUserIdByUsername = async (username: string) => {
	return await upstashClient.hget(`username:${username}`, 'userId') as string
}

export const deleteUsername = async (
	username: string,
) => {
	return await upstashClient.hdel(`username:${username}`, 'userId', 'osteopathId');
};

export const createUsername = async (
	username: string,
	osteopathId: string,
	userId: string,
) => {
	return await upstashClient.hset(`username:${username}`, {
		osteopathId,
		userId
	});
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
