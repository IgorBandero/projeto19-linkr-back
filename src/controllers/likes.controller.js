import { likesSELECT,likesINSERT,likesDELETEfrom,likesSELECTJoined } from "../repositories/likes.repository.js";
import { selectSession } from "../repositories/session.repository.js";
import { db } from "../database/database.js";
export async function likesGET(req, res) 
{
	const session = res.locals.session;
	const searchPost = req.query.term;
	try
	{	
		// const session = await selectSession(token)
		// if(session.rowCount === 0 ) return res.status(404).send();
		const user_id = session.rows[0].user_id
		const likes = await likesSELECT(searchPost)
		if(likes.rows.length === 0){
			return res.status(200).send({ likes:0 ,you:""});
		}
		const userLikes = await db.query(`SELECT * FROM likes WHERE post_id = $1 AND user_id = $2`,[searchPost, user_id])
		const you = userLikes.rowCount !== 0 ? true:false
		
		return res.status(200).send({likes:likes.rowCount,you:you});
	}catch(error){
		console.log(error);
		return res.status(500).send(error)}
}
export async function likesPOST(req, res) 
{
	const session = res.locals.session;
	const { post_id } = req.body
	console.log(session);
	try
	{
		const user_id = session.rows[0].user_id
		await likesINSERT(post_id, user_id)
		return res.sendStatus(201)
	}catch(error){
		console.log(error.message);	
		res.status(500).send({message: error.message})
	}
}
export async function likesDELETE(req, res) 
{
	const session = res.locals.session;
	const { post_id} = req.body
	try
	{
		const user_id = session.rows[0].user_id
		await likesDELETEfrom(post_id,user_id)
		// console.log(session.rows)
		return res.status(201).send({you:session})
	}catch(error){
		console.log(error.message);	
		res.status(500).send({message: error.message})
	}
}
export async function likesUSERSGET(req, res) 
{
	const { post_id} = req.body
	try
	{
		const likes = await likesSELECTJoined(post_id)
		return res.status(200).send(likes.rows)
	}catch(error){
		console.log(error.message);	
		res.status(500).send({message: error.message})
	}
}
