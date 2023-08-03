import { Col, Row } from 'react-bootstrap';
import BalanceBlock from './BalanceBlock/BalanceBlock';
import DollarIcon from '../../../../Assets/Images/DollarIcon.png';
import LockIcon from "../../../../Assets/Images/LockIcon.png";
import CurrencyIcon from '../../../../Assets/Images/CurrencyIcon.png';
import "./Balance.scss"
import CustomTable from '../../../Common/Table/Index';

const Balance = () => {
    const data = [
        {
            balanceImg: DollarIcon,
            balanceTitle: "Total Balance",
            balanceAmount: "$10,000",
        },
        {
            balanceImg: LockIcon,
            balanceTitle: "Blocked Balance",
            balanceAmount: "$9,0000",
        },
        {
            balanceImg: CurrencyIcon,
            balanceTitle: "Available Balance",
            balanceAmount: "$8,0000",
        },
    ]

    const fields = ["Sr No", "Hash", "Type", "Time & Date", "Payment ID"];

    const claim = [
        {
            sr: "01",
            hash: "0x73hdjxnsjsj383898w9w9xmxms930",
            type: "Debit Card",
            time: "12:02 PM 23-05-2023",
            payment: "#18273822hg",
        },
        {
            sr: "02",
            hash: "0x73hdjxnsjsj383898w9w9xmxms930",
            type: "Debit Card",
            time: "12:02 PM 23-05-2023",
            payment: "#18273822hg",
        },
        {
            sr: "03",
            hash: "0x73hdjxnsjsj383898w9w9xmxms930",
            type: "Debit Card",
            time: "12:02 PM 23-05-2023",
            payment: "#18273822hg",
        },
        {
            sr: "04",
            hash: "0x73hdjxnsjsj383898w9w9xmxms930",
            type: "Debit Card",
            time: "12:02 PM 23-05-2023",
            payment: "#18273822hg",
        },
        {
            sr: "05",
            hash: "0x73hdjxnsjsj383898w9w9xmxms930",
            type: "Debit Card",
            time: "12:02 PM 23-05-2023",
            payment: "#18273822hg",
        },
    ];

    return (
        <>
            <section className='balance_sec'>
                <Row>
                    {data.map((item, index) => (
                        < Col sm={6} lg={4} key={index} >
                            <BalanceBlock balanceImg={item.balanceImg} balanceTitle={item.balanceTitle} balanceAmount={item.balanceAmount} />
                        </Col>
                    ))}
                </Row>
                <Row>
                    <Col>
                        <h6>Transactions</h6>
                        <CustomTable fields={fields} sortbuttons={true}
                            children={claim?.map((item: any, index: number) => (
                                <tr key={index}>
                                    <td>{item.sr}</td>
                                    <td className="text-start">{item.hash}</td>
                                    <td className="text-start">{item.type}</td>
                                    <td className='text-start'>
                                        {item.time}
                                    </td>
                                    <td className='text-start'>
                                        {item.payment}
                                    </td>
                                </tr>
                            ))}
                        />
                    </Col>
                </Row>
            </section >
        </>
    );
};

export default Balance;