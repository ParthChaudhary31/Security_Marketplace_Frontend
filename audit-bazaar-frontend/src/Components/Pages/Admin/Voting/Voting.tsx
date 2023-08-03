import { Container, Row, Tab, Tabs } from 'react-bootstrap';
import "./Voting.scss";
import CustomTable from '../../../Common/Table/Index';
import ButtonCustom from '../../../Common/Button/ButtonCustom';
import CustomPagination from '../../../Common/CustomPagination/CustomPagination';

const Voting = () => {
    const fields = ["U ID", "Name", "Email", "Gitlab URL", "Action"];
    const fields2 = ["U ID", "Total Votes", "In Favour Votes", "Completed", "Action"];

    const claim = [
        {
            UID: "27384",
            Name: "Bradley Cooper",
            Email: "BradleyCooper22@gmail.com",
            GitlabURL: "www.auditbaazar.com",
        },
        {
            UID: "27384",
            Name: "Bradley Cooper",
            Email: "BradleyCooper22@gmail.com",
            GitlabURL: "www.auditbaazar.com",
        },
        {
            UID: "27384",
            Name: "Bradley Cooper",
            Email: "BradleyCooper22@gmail.com",
            GitlabURL: "www.auditbaazar.com",
        },
        {
            UID: "27384",
            Name: "Bradley Cooper",
            Email: "BradleyCooper22@gmail.com",
            GitlabURL: "www.auditbaazar.com",
        },
        {
            UID: "27384",
            Name: "Bradley Cooper",
            Email: "BradleyCooper22@gmail.com",
            GitlabURL: "www.auditbaazar.com",
        },
    ];

    const claim2 = [
        {
            UID: "27384",
            Name: "Bradley Cooper",
            email: "BradleyCooper22@gmail.com",
            GitlabURL: "www.auditbaazar.com",
        },
        {
            UID: "27384",
            Name: "Bradley Cooper",
            email: "Jognsmith23@gmail.com",
            GitlabURL: "www.auditbaazar.com",
        },
        {
            UID: "27384",
            Name: "Bradley Cooper",
            email: "BradleyCooper22@gmail.com",
            GitlabURL: "www.auditbaazar.com",
        },
        {
            UID: "27384",
            Name: "Bradley Cooper",
            email: "Jognsmith23@gmail.com",
            GitlabURL: "www.auditbaazar.com",
        },
        {
            UID: "27384",
            Name: "Bradley Cooper",
            email: "Jognsmith23@gmail.com",
            GitlabURL: "www.auditbaazar.com",
        },
        {
            UID: "27384",
            Name: "Bradley Cooper",
            email: "BradleyCooper22@gmail.com",
            GitlabURL: "www.auditbaazar.com",
        },
        {
            UID: "27384",
            Name: "Bradley Cooper",
            email: "BradleyCooper22@gmail.com",
            GitlabURL: "www.auditbaazar.com",
        },
    ];

    const claim3 = [
        {
            UID: "27384",
            votes: "02",
            favorVotes: "02",
            completed: "02",
            close: "Closed",
        },
        {
            UID: "27384",
            votes: "02",
            favorVotes: "02",
            completed: "02",
            close: "Closed",
        },
        {
            UID: "27384",
            votes: "02",
            favorVotes: "02",
            completed: "02",
            close: "Closed",
        },
        {
            UID: "27384",
            votes: "02",
            favorVotes: "02",
            completed: "02",
            close: "Closed",
        },
        {
            UID: "27384",
            votes: "02",
            favorVotes: "02",
            completed: "02",
            close: "Closed",
        },
    ];

    return (
        <>
            <section className='voting_sec'>
                <Container fluid>
                    <Row>
                        <Tabs
                            defaultActiveKey="Pending"
                            id="uncontrolled-tab-example"
                            className="voting_tab"
                        >
                            <Tab eventKey="Pending" title="Pending">
                                <CustomTable fields={fields} sortbuttons={true}
                                    children={claim?.map((item: any, index: number) => (
                                        <tr key={index}>
                                            <td>{item.UID}</td>
                                            <td className="text-start">{item.Name}</td>
                                            <td className="text-start">{item.Email}</td>
                                            <td className='text-start'>
                                                {item.GitlabURL}
                                            </td>
                                            <td className='text-start'>
                                                <div className='progress_btn'>
                                                    <ButtonCustom
                                                        title="View"
                                                        type="submit"
                                                        className="view_btn bordered"
                                                    />
                                                    <ButtonCustom
                                                        title="Vote"
                                                        type="submit"
                                                        className="vote_btn bordered"
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                />
                            </Tab>
                            <Tab eventKey="In Progress" title="In Progress">
                                <CustomTable fields={fields} sortbuttons={true}
                                    children={claim2?.map((item: any, index: number) => (
                                        <tr key={index}>
                                            <td>{item.UID}</td>
                                            <td className="text-start">{item.Name}</td>
                                            <td className="text-start">{item.email}</td>
                                            <td className='text-start'>
                                                {item.GitlabURL}
                                            </td>
                                            <td className='text-start'>
                                                <div className='progress_btn'>
                                                    <ButtonCustom
                                                        title="View"
                                                        type="submit"
                                                        className="view_btn bordered"
                                                    />
                                                    <ButtonCustom
                                                        title="Vote"
                                                        type="submit"
                                                        className="vote_btn bordered"
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                />
                            </Tab>
                            <Tab eventKey="Completed" title="Completed">
                                <CustomTable fields={fields2} sortbuttons={true}
                                    children={claim3?.map((item: any, index: number) => (
                                        <tr key={index}>
                                            <td>{item.UID}</td>
                                            <td className="text-start">{item.votes}</td>
                                            <td className="text-start">{item.favorVotes}</td>
                                            <td className='text-start text_green'>
                                                {item.completed}
                                            </td>
                                            <td className='text-start text_red'>
                                                {item.close}
                                            </td>
                                        </tr>
                                    ))}
                                />
                            </Tab>
                        </Tabs>
                        <CustomPagination className="dashboard_pagination" />
                    </Row>
                </Container>
            </section>
        </>
    );
};

export default Voting;