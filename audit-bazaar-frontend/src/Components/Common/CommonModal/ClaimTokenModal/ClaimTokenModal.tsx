import CommonModal from "../CommonModal";
import ButtonCustom from "../../Button/ButtonCustom";
import CustomTable from "../../Table/Index";
import "./ClaimTokenModal.scss";

interface ClaimTokenModal {
  show?: boolean;
  onHide?: () => void;
}

const ClaimTokenModal = (props: ClaimTokenModal) => {
  const fields = ["Select Phase", "Tokens", "Claimable Tokens", "Action"];

  const claimData = [
    {
      phase: "Pre Sale Round 1",
      token: "0.00",
      claimToken: "0.00",
    },
    {
      phase: "Pre Sale Round 2",
      token: "0.00",
      claimToken: "0.00",
    },
    {
      phase: "Pre Sale Round 3",
      token: "0.00",
      claimToken: "0.00",
    },
    {
      phase: "ICO Public Sale",
      token: "0.00",
      claimToken: "0.00",
    },
    {
      phase: "Ecosystem",
      token: "0.00",
      claimToken: "0.00",
    },
  ];
  return (
    <CommonModal
      show={props.show}
      onHide={props.onHide}
      heading="Claim Tokens"
      className="claim-token-modal"
      crossBtn
    >
      <CustomTable fields={fields} sortbuttons={false}>
        {claimData.map((item, index) => (
          <tr key={index}>
            <td>{item.phase}</td>
            <td className="text-center">{item.token}</td>
            <td className="text-center">{item.claimToken}</td>
            <td>
              <ButtonCustom title="Claim" className="sm-btn mx-auto" />
            </td>
          </tr>
        ))}
      </CustomTable>
    </CommonModal>
  );
};

export default ClaimTokenModal;
