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
        if (!userEmail) {
            message.error("Please login to vote")
            return
        }

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
            const updatedPoll: any = latestPollFromFirebase
            updatedPoll[option] = [...latestPollFromFirebase[option], userEmail]

            try {
                await setDoc(doc(db, "polls", pollId), updatedPoll);
                message.success("Vote Done")
                getPolls()
            } catch (error) {
                console.error(error)
                message.error("Error in casting vote")
            }
        }

    }

    const votesFor = (key: string) => (data[key]?.length || 0)
    const totalVotes = votesFor("opt_1_votes") + votesFor("opt_2_votes") + votesFor("opt_3_votes") + votesFor("opt_4_votes")
    const percentFor = (key: string) => totalVotes === 0 ? 0 : Math.round((votesFor(key) / totalVotes) * 100)
    const hasVotedFor = (key: string) => currentUser?.email ? data[key]?.includes(currentUser.email) : false

    return (
        <div className="singlePoll">
            <div className="stub-top">
                <p className="question">{data.question}</p>
                <b>{data.userEmail}</b>
            </div>

            <hr className="perforation" />

            <AntdProgress
                text={data.option_1}
                percent={percentFor("opt_1_votes")}
                count={votesFor("opt_1_votes")}
                voted={hasVotedFor("opt_1_votes")}
                onClick={() => handleOptionClick("opt_1_votes", data.id)}
            />
            <AntdProgress
                text={data.option_2}
                percent={percentFor("opt_2_votes")}
                count={votesFor("opt_2_votes")}
                voted={hasVotedFor("opt_2_votes")}
                onClick={() => handleOptionClick("opt_2_votes", data.id)}
            />
            <AntdProgress
                text={data.option_3}
                percent={percentFor("opt_3_votes")}
                count={votesFor("opt_3_votes")}
                voted={hasVotedFor("opt_3_votes")}
                onClick={() => handleOptionClick("opt_3_votes", data.id)}
            />
            <AntdProgress
                text={data.option_4}
                percent={percentFor("opt_4_votes")}
                count={votesFor("opt_4_votes")}
                voted={hasVotedFor("opt_4_votes")}
                onClick={() => handleOptionClick("opt_4_votes", data.id)}
            />

            <div className="stub-footer">
                <h5>{moment(data.createdAt).fromNow()} · {totalVotes} vote{totalVotes === 1 ? "" : "s"} total</h5>

                {currentUser?.email === data.userEmail ? <AntdButton
                    text="Delete"
                    onClick={() => handleDelete(data.id)}
                    color="danger"
                /> : null}
            </div>
        </div>
    )
}

export default SinglePoll