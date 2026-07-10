import { useEffect, useState } from "react"
import { AntdInput } from "./AntdInput"
import "./index.scss"
import { AntdButton } from "./AntdButton"
import { message } from "antd"
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../config/firebase"
import { useSelector } from "react-redux"
import SinglePoll from "./SinglePoll"

const AddPollform = () => {
    const currentUser = useSelector((state: any) => state.user)

    const [question, set_question] = useState("")
    const [option_1, set_option_1] = useState("")
    const [option_2, set_option_2] = useState("")
    const [option_3, set_option_3] = useState("")
    const [option_4, set_option_4] = useState("")

    const handleSubmit = async () => {

        if (!question) {
            message.error("question is required")
            return
        }
        if (!option_1) {
            message.error("option 1 is required")
            return
        }
        if (!option_2) {
            message.error("option 2 is required")
            return
        }
        if (!option_3) {
            message.error("option 3 is required")
            return
        }
        if (!option_4) {
            message.error("option 4 is required")
            return
        }

        try {
            await addDoc(collection(db, "polls"), {
                question: question,
                option_1: option_1,
                option_2: option_2,
                option_3: option_3,
                option_4: option_4,
                userEmail: currentUser?.email || "",
                createdAt: new Date().getTime(),
                opt_1_votes: [],
                opt_2_votes: [],
                opt_3_votes: [],
                opt_4_votes: [],
            });
            message.success("Poll Created")
            set_question("")
            set_option_1("")
            set_option_2("")
            set_option_3("")
            set_option_4("")
            getPolls()

        } catch (error) {
            console.error(error)
            message.error("Error in poll creation")
        }
    }

    useEffect(() => {
        getPolls()
    }, [])

    const [polls, set_polls] = useState([])

    const getPolls = async () => {
        const querySnapshot = await getDocs(collection(db, "polls"));
        const allPolls: any = []

        querySnapshot.forEach((doc) => {
            allPolls.push({
                ...doc.data(),
                id: doc.id
            })
        });

        set_polls(allPolls)
    }

    return (
        <div>
            <form className="pollingForm">
                <h2>Create Poll</h2>

                <AntdInput
                    placeholder="Enter your poll question.. "
                    type="text" className="questionInput" value={question}
                    onChange={(e: any) => set_question(e.target.value)}
                />

                <AntdInput
                    placeholder="Enter option 1.. "
                    type="text" value={option_1}
                    onChange={(e: any) => set_option_1(e.target.value)}
                />
                <AntdInput
                    placeholder="Enter option 2.. "
                    type="text" value={option_2}
                    onChange={(e: any) => set_option_2(e.target.value)}
                />
                <AntdInput
                    placeholder="Enter option 3.. "
                    type="text" value={option_3}
                    onChange={(e: any) => set_option_3(e.target.value)}
                />
                <AntdInput
                    placeholder="Enter option 4.. "
                    type="text" value={option_4}
                    onChange={(e: any) => set_option_4(e.target.value)}
                />

                <div></div>
                <AntdButton
                    text="Create Poll"
                    onClick={handleSubmit}
                />
            </form>

            {polls.map((singleData: any, index: number) => {
                return (
                    <SinglePoll
                        key={index}
                        data={singleData}
                        getPolls={getPolls}
                    />
                )
            })}
        </div>
    )
}

export default AddPollform