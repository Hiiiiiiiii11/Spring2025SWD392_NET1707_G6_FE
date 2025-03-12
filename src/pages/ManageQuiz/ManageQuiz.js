import React, { useState, useEffect } from "react";
import { Table, Input, Button, Form, Modal, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import "./ManageQuiz.css";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import { CreateNewQuizAPI, DeleteQuizAPI, GetAllQuizAPI } from "../../services/ManageQuizService";
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

    // Các loại quiz: ví dụ MULTI_CHOICE và YES_NO
    const quizTypes = ["MULTI_CHOICE", "SINGLE_CHOICE", "TEXTINPUT"];

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
        // Chuyển mảng options thành chuỗi, cách nhau bởi dấu phẩy
        const optionsStr = record.options.join(", ");
        form.setFieldsValue({
            question: record.question,
            type: record.type,
            options: optionsStr,
        });
        setIsModalVisible(true);
    };

    const handleDeleteQuiz = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this promotion?");
        if (!confirmDelete) return;
        try {
            await DeleteQuizAPI(id);
            toast.success("Quiz question deleted successfully!");
            fetchQuizzes();
        } catch (e) {
            toast.error('Fail to delete promotion!')
        }


    };

    const handleModalOk = async () => {
        try {
            const values = await form.validateFields();
            // Nếu loại câu hỏi là YES_NO, ta đặt mặc định options là ["Yes", "No"]
            let options;
            if (values.type === "SINGLE_CHOICE") {
                options = ["Yes", "No"];
            } else {
                // Nếu MULTI_CHOICE, chuyển chuỗi nhập từ form thành mảng
                options = values.options
                    .split(",")
                    .map((opt) => opt.trim())
                    .filter((opt) => opt);
            }

            const quizData = {
                question: values.question,
                type: values.type,
                options: options,
            };

            if (editMode) {
                const updatedQuiz = [];
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
            alert("Error processing quiz question!");
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
                <div className="manager-container">
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
