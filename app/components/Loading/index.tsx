import OpenAiLogo from "../OpenAiLogo";

function Loading() {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <OpenAiLogo rotate width="3em" height="3em" />
    </div>
  );
}

export default Loading;
