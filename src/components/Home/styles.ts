import styled from "styled-components";

export const HeroBlock = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 90vh;
  padding: 0px 2%;
  @media screen and (max-width: 960px) {
    height: auto;
    padding: 0;
  }
`;

export const Container = styled.div`
  display: flex;
  width: 100%;
  height: 85vh;
  @media screen and (max-width: 960px) {
    flex-direction: column;
    padding: 0 10px;
    height: auto;
  }
`;

export const LeftPanel = styled.div`
  flex: 1;
  max-width: 500px;
  padding: 8% 5%;
  display: flex;
  flex-direction: column;
  @media screen and (max-width: 960px) {
    padding: 5% 5%;
  }
`;

export const Title = styled.span`
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #5c2e99;
  @media screen and (max-width: 960px) {
    margin-bottom: 15px;
  }
`;

export const Subtitle = styled.span`
  font-size: 16px;
  color: #666;
  margin-bottom: 40px;
`;

export const Form = styled.form`
  width: 100%;
`;

export const InputGroup = styled.div`
  margin-bottom: 20px;
  width: 100%;
`;

export const Input = styled.input`
  width: 100%;
  padding: 15px;
  border-radius: 30px;
  border: 1px solid #ddd;
  font-size: 15px;
  outline: none;
  box-sizing: border-box;
  &:focus {
    border-color: #2196f3;
  }
`;

export const UploadInput = styled.input`
  width: 100%;
  padding: 13px;
  border-radius: 30px;
  border: 1px solid #ddd;
  font-size: 15px;
  outline: none;
  box-sizing: border-box;
  background-color: #efefef;
`;

export const UploadButton = styled.button`
  width: 30%;
  padding: 12px;
  border-radius: 30px;
  border: none;
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 15px;
  cursor: pointer;
  display: flex;
  gap: 10px;
  margin-top: 30px;
  align-items: center;
  justify-content: center;
  color: #fff;
  background-color: #5c2e99;
  @media screen and (max-width: 960px) {
    width: 94%;
  }
`;

export const RightPanel = styled.div`
  flex: 1.2;
  background-color: #efefef;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  position: relative;
  border-radius: 20px;
  padding: 40px 0 120px;
  overflow: hidden;
  @media screen and (max-width: 960px) {
    height: auto;
    margin-bottom: 10%;
  }
`;

export const AssistantContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 70%;
  margin-top: 30px;
  padding-bottom: 80px;
  @media screen and (max-width: 960px) {
    width: 90%;
    padding-bottom: 10px;
  }
`;

export const AvatarImage = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #333;
  margin-bottom: 20px;
  position: relative;
  @media screen and (max-width: 960px) {
    margin-top: 0;
  }
`;

export const UploadTextDisplay = styled.span`
  font-size: 16px;
  line-height: 1.6;
  color: #333;
  margin-bottom: 30px;
  max-height: 400px;
  overflow-y: auto;
  word-wrap: break-word;
  text-align: justify;
  @media screen and (max-width: 960px) {
    max-height: 100%;
  }
`;

export const SearchBar = styled.div`
  position: absolute;
  bottom: 30px;
  width: 80%;
  border-radius: 30px;
  border: 1px solid #eee;
  background-color: white;
  padding: 15px 20px;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  @media screen and (max-width: 960px) {
    width: 85%;
    bottom: 20px;
    padding: 12px 15px;
  }
`;

export const SearchInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  font-size: 16px;
  color: #333;
  background: transparent;
  padding: 0 10px;
`;

export const SearchIcon = styled.img`
  width: 24px;
  height: 24px;
  margin-right: 10px;
  border-radius: 50%;
`;

// Start mock interview //
export const MockBtnContainer = styled.div`
  display: flex;
  @media screen and (max-width: 960px) {
    flex-direction: column;
  }
`;

export const StartMockBtn = styled.button`
  width: 30%;
  height: 42px;
  padding: 12px;
  border-radius: 30px;
  border: none;
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 15px;
  cursor: pointer;
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: center;
  color: #fff;
  background-color: #5c2e99;
  margin-right: 50px;
  @media screen and (max-width: 960px) {
    width: 94%;
    margin-right: 0px;
  }
`;

// Call //
export const CallContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const VideoContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  padding-top: 10px;
  justify-content: center;
`;

export const VideoWrapper = styled.div`
  display: flex;
  width: 90%;
  height: 90%;
  justify-content: center;
  padding-top: 10px;
  @media screen and (max-width: 960px) {
    width: 100%;
  }
`;

export const Video = styled.video`
  width: 85%;
  object-fit: cover;
  border-radius: 20px;
  outline: none;
  &:focus {
    outline: 1px solid;
  }
  @media screen and (max-width: 960px) {
    height: 75dvh;
    width: 100%;
  }
`;

export const EndCallBtn = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  @media screen and (max-width: 960px) {
    margin-bottom: 40px;
  }
`;

export const EndMockBtn = styled.button`
  width: 20%;
  height: 42px;
  padding: 12px;
  border-radius: 30px;
  border: none;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: center;
  color: #fff;
  background-color: #fb4141;
  @media screen and (max-width: 960px) {
    margin-top: 20px;
    width: 50%;
  }
`;

export const StatusTextContainer = styled.div`
  display: flex;
  width: 100%;
  margin-top: 10px;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
  flex-direction: column;
  @media screen and (max-width: 960px) {
    margin-bottom: 0px;
  }
`;

export const StatusCall = styled.div`
  position: absolute,
  bottom: 100px,
  left: 50%,
  transform: translateX(-50%),
  padding: 10px,
  border-radius: 10px,
`;

export const ErrorMockQuestion = styled.div`
  display: flex,
  justify-content: center,
  align-items: center,
  height: 100%,
  padding: 20px,
  text-align: center,
  color: #fb4141,
  flex-direction: column,
`;

export const Livetext = styled.span`
  font-size: 16px;
  color: #666;
  margin-top: 10px;
`;

// Loading //
export const LoadingBlock = styled.div`
  width: 100vw;
  height: 90vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const LoadingGif = styled.img`
  width: 50px;
`;
