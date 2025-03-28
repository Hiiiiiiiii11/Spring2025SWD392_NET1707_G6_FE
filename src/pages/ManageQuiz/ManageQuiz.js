import React, { useState, useEffect } from "react";
import { Table, Input, Button, Form, Modal, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import "./ManageQuiz.css";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import {
    CreateNewQuizAPI,
    DeleteQuizAPI,
    GetAllQuizAPI,
    UpdateNewQuizAPI, // <-- Import the update API function
} from "../../services/ManageQuizService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ManageQuiz() {
    const [quizzes, setQuizzes] = useState([]);
    const [search, setSearch] = useState("");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editQuizId, setEditQuizId] = useState(null);
    const [form] = Form.useForm();
    const navigate = useNavigate();

    // Quiz types available in your system
    const quizTypes = ["HYPERPIGMENTATION", "REDNESS", "AGING", "ACNE", "SENSITIVITY", "DRYNESS", "OILINESS"];
    // Dropdown labels from your provided JSON (ensure these are unique)
    const quizLabels = ["oiliness", "dryness", "sensitivity", "acne", "aging", "hyperpigmentation", "redness"];

    useEffect(() => {
        fetchQuizzes();
    }, []);

    const fetchQuizzes = async () => {
        try {
            const data = await GetAllQuizAPI();
            if (data) {
                setQuizzes(data);
            }
        } catch (error) {
            toast.error("Failed to fetch quizzes");
        }
    };

    const handleAddNewQuiz = () => {
        setEditMode(false);
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleEditQuiz = (record) => {
        setEditMode(true);
        setEditQuizId(record.questionId);
        // Convert options array into comma-separated string
        const optionsStr = record.options.join(", ");
        form.setFieldsValue({
            question: record.question,
            type: record.type,
            label: record.label, // preselect the label when editing
            options: optionsStr,
        });
        setIsModalVisible(true);
    };

    const handleDeleteQuiz = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this quiz question?");
        if (!confirmDelete) return;
        try {
            await DeleteQuizAPI(id);
            toast.success("Quiz question deleted successfully!");
            fetchQuizzes();
        } catch (e) {
            toast.error("Failed to delete quiz question!");
        }
    };

    const handleModalOk = async () => {
        try {
            const values = await form.validateFields();
            // Process options: split by comma and trim each one
            const options = values.options
                .split(",")
                .map((opt) => opt.trim())
                .filter((opt) => opt);

            const quizData = {
                question: values.question,
                type: values.type,
                label: values.label, // include the label value
                options: options,
            };

            if (editMode) {
                const updatedQuiz = await UpdateNewQuizAPI(editQuizId, quizData);
                if (updatedQuiz) {
                    toast.success("Quiz question updated successfully!");
                    fetchQuizzes();
                } else {
                    toast.error("Failed to update quiz question!");
                }
            } else {
                const newQuiz = await CreateNewQuizAPI(quizData);
                if (newQuiz) {
                    toast.success("Quiz question added successfully!");
                    fetchQuizzes();
                } else {
                    toast.error("Failed to add quiz question!");
                }
            }
            setIsModalVisible(false);
            form.resetFields();
        } catch (error) {
            toast.error("Error processing quiz question!");
        }
    };

    const filteredQuizzes = quizzes.filter((q) =>
        q.question.toLowerCase().includes(search.toLowerCase())
    );

    const columns = [
        {
            title: "Question",
            dataIndex: "question",
            key: "question",
            sorter: (a, b) => a.question.localeCompare(b.question),
        },
        {
            title: "Type",
            dataIndex: "type",
            key: "type",
        },
        {
            title: "Options",
            dataIndex: "options",
            key: "options",
            render: (options) => options.join(", "),
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <>
                    <Button type="link" onClick={() => handleEditQuiz(record)}>
                        Edit
                    </Button>
                    <Button type="link" danger onClick={() => handleDeleteQuiz(record.questionId)}>
                        Delete
                    </Button>
                </>
            ),
        },
    ];

    return (
        <div>
            <Header />
            <ToastContainer />
            <div className="manager-quiz-page">
                <div className="manager-container" style={{ minHeight: "100vh" }}>
                    <h2>Manage Quiz Questions</h2>
                    <div
                        style={{
                            marginBottom: 16,
                            display: "flex",
                            justifyContent: "space-between",
                        }}
                    >
                        <Input
                            style={{ width: "400px", height: "40px" }}
                            placeholder="Search quiz question..."
                            onChange={(e) => setSearch(e.target.value)}
                            suffix={<SearchOutlined />}
                        />
                        <Button type="primary" onClick={handleAddNewQuiz}>
                            + Add New Quiz
                        </Button>
                    </div>
                    <Table dataSource={filteredQuizzes} columns={columns} rowKey="questionId" />

                    <Modal
                        title={editMode ? "Edit Quiz Question" : "Add Quiz Question"}
                        open={isModalVisible}
                        onOk={handleModalOk}
                        onCancel={() => setIsModalVisible(false)}
                        okText={editMode ? "Save Changes" : "Add Quiz"}
                    >
                        <Form form={form} layout="vertical">
                            <Form.Item
                                name="question"
                                label="Question"
                                rules={[{ required: true, message: "Question is required!" }]}
                            >
                                <Input placeholder="Enter quiz question" />
                            </Form.Item>
                            <Form.Item
                                name="type"
                                label="Type"
                                rules={[{ required: true, message: "Please select a quiz type" }]}
                            >
                                <Select placeholder="Select quiz type">
                                    {quizTypes.map((type) => (
                                        <Select.Option key={type} value={type}>
                                            {type}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item
                                name="options"
                                label="Options (separated by comma)"
                                rules={[{ required: true, message: "Options are required!" }]}
                            >
                                <Input.TextArea placeholder="Enter options separated by comma" />
                            </Form.Item>
                        </Form>
                    </Modal>
                </div>
            </div>
        </div>
    );
}

export default ManageQuiz;
