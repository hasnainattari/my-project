import { useSelector } from "react-redux"
import { AntdButton } from "./AntdButton"
import AntdProgress from "./AntdProgress"
import "./index.scss"
import moment from 'moment'
import { doc, deleteDoc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase"
import { message } from "antd"

const SinglePoll = ({ data, getPolls }: any) => {
    const currentUser = useSelector((state: any) => state.user)

    const handleDelete = async (id: string) => {
        try {
            await deleteDoc(doc(db, "polls", id));
            message.success("Poll Deleted")
            getPolls()
        } catch (error) {
            console.error(error)
            message.error("Error in deleting poll")
        }
    }

    const handleOptionClick = async (option: string, pollId: string) => {
        const userEmail = currentUser?.email

        const docRef = doc(db, "polls", pollId);
        const docSnap = await getDoc(docRef);
        const latestPollFromFirebase: any = docSnap.data()

        const allVotes = [
            ...latestPollFromFirebase.opt_1_votes,
            ...latestPollFromFirebase.opt_2_votes,
            ...latestPollFromFirebase.opt_3_votes,
            ...latestPollFromFirebase.opt_4_votes,
        ]

        if (allVotes.includes(userEmail)) {
            message.error("you have already voted")

        } else {
            const updatedPoll: any = data
            updatedPoll[option] = [...data[option], userEmail]

            try {
                await setDoc(doc(db, "polls", pollId), updatedPoll);
                message.success("Vote Done")
            } catch (error) {
                console.error(error)
            }
        }

    }

    return (
        <div className="singlePoll">
            <b>{data.userEmail}</b>
            <p>Question: {data.question}</p>

            <AntdProgress
                text={data.option_1}
                percent={90}
                onClick={() => handleOptionClick("opt_1_votes", data.id)}
            />
            <AntdProgress
                text={data.option_2}
                percent={50}
                onClick={() => handleOptionClick("opt_2_votes", data.id)}
            />
            <AntdProgress
                text={data.option_3}
                percent={30}
                onClick={() => handleOptionClick("opt_3_votes", data.id)}
            />
            <AntdProgress
                text={data.option_4}
                percent={70}
                onClick={() => handleOptionClick("opt_4_votes", data.id)}
            />

            <h5>{moment(data.createdAt).fromNow()}</h5>

            {currentUser.email === data.userEmail ? <AntdButton
                text="Delete"
                onClick={() => handleDelete(data.id)}
                color="danger"
            /> : null}

        </div>
    )
}

export default SinglePoll