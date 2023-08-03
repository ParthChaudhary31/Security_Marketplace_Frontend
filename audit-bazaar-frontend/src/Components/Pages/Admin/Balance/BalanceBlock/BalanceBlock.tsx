import "./BalanceBlock.scss";

const BalanceBlock = ({ balanceTitle, balanceAmount, balanceImg }) => {
    return (
        <>
            <div className='balance_block'>
                <div className='balance_block_img'><img src={balanceImg} alt="" /></div>
                <div className='balance_block_info'>
                    <h3>{balanceTitle}</h3>
                    <h2>{balanceAmount}</h2>
                </div>
            </div>
        </>
    );
};

export default BalanceBlock;