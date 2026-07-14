import { useState } from "react"
import { useSelector } from "react-redux"
import { AntdButton } from "./AntdButton"
import AntdProgress from "./AntdProgress"
import "./index.scss"
import moment from 'moment'
import { doc, deleteDoc, updateDoc, getDoc, arrayUnion } from "firebase/firestore";
import { db } from "../config/firebase"
import { message } from "antd"

const OPTION_KEYS = ["opt_1_votes", "opt_2_votes", "opt_3_votes", "opt_4_votes"]

const SinglePoll = ({ data, getPolls }: any) => {
    const currentUser = useSelector((state: any) => state.user)
    const [isVoting, setIsVoting] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = async (id: string) => {
        if (isDeleting) return
        setIsDeleting(true)
        try {
            await deleteDoc(doc(db, "polls", id));
            message.success("Poll deleted")
            getPolls()
        } catch (error) {
            console.error(error)
            message.error("Error in deleting poll")
        } finally {
            setIsDeleting(false)
        }
    }

    // Which option (if any) the current user has already voted for
    const votedOptionKey = OPTION_KEYS.find((key) =>
        currentUser?.email ? (data[key] || []).includes(currentUser.email) : false
    )
    const hasVotedAlready = Boolean(votedOptionKey)

    const handleOptionClick = async (option: string, pollId: string) => {
        const userEmail = currentUser?.email
        if (!userEmail) {
            message.error("Please login to vote")
            return
        }

        if (hasVotedAlready) {
            message.error("You have already voted on this poll")
            return
        }

        if (isVoting) return
        setIsVoting(true)

        try {
            const docRef = doc(db, "polls", pollId);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) {
                message.error("This poll no longer exists")
                return
            }

            const latestPoll: any = docSnap.data()

            const allVotes = OPTION_KEYS.flatMap((key) => latestPoll[key] || [])

            if (allVotes.includes(userEmail)) {
                message.error("You have already voted on this poll")
                getPolls()
                return
            }

            // Atomic, additive update — never overwrites the whole document,
            // so concurrent votes from other users are never lost, and the
            // percentages always reflect the true, latest vote counts.
            await updateDoc(docRef, {
                [option]: arrayUnion(userEmail)
            });

            message.success("Vote recorded")
            getPolls()
        } catch (error) {
            console.error(error)
            message.error("Error while voting, please try again")
        } finally {
            setIsVoting(false)
        }
    }

    const votesFor = (key: string) => (data[key]?.length || 0)
    const totalVotes = OPTION_KEYS.reduce((sum, key) => sum + votesFor(key), 0)
    // Keep full precision for the bar width so it always lines up with the
    // real proportion of votes, and only round for the number shown as text.
    const percentFor = (key: string) => totalVotes === 0 ? 0 : (votesFor(key) / totalVotes) * 100
    const displayPercentFor = (key: string) => Math.round(percentFor(key))
    const hasVotedFor = (key: string) => currentUser?.email ? (data[key] || []).includes(currentUser.email) : false

    const options = [
        { key: "opt_1_votes", text: data.option_1 },
        { key: "opt_2_votes", text: data.option_2 },
        { key: "opt_3_votes", text: data.option_3 },
        { key: "opt_4_votes", text: data.option_4 },
    ]

    return (
        <div className="singlePoll">
            <div className="stub-top">
                <p className="question">{data.question}</p>
                <b>{data.userEmail}</b>
            </div>

            <hr className="perforation" />

            <div className="options-list">
                {options.map(({ key, text }) => (
                    <AntdProgress
                        key={key}
                        text={text}
                        percent={percentFor(key)}
                        displayPercent={displayPercentFor(key)}
                        count={votesFor(key)}
                        voted={hasVotedFor(key)}
                        disabled={hasVotedAlready || isVoting}
                        onClick={() => handleOptionClick(key, data.id)}
                    />
                ))}
            </div>

            <div className="stub-footer">
                <h5>{moment(data.createdAt).fromNow()} · {totalVotes} vote{totalVotes === 1 ? "" : "s"} total</h5>

                {currentUser?.email === data.userEmail ? <AntdButton
                    text={isDeleting ? "Deleting..." : "Delete"}
                    onClick={() => handleDelete(data.id)}
                    color="danger"
                /> : null}
            </div>
        </div>
    )
}

export default SinglePoll
