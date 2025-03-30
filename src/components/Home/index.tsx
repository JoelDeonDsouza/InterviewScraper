import { useRef } from "react";
import type { ChangeEvent } from "react";
// Styles //
import {
  HeroBlock,
  Container,
  LeftPanel,
  RightPanel,
  Title,
  Subtitle,
  Form,
  InputGroup,
  Input,
  UploadInput,
  UploadButton,
  MockBtnContainer,
  StartMockBtn,
  AssistantContainer,
  AvatarImage,
  UploadTextDisplay,
  SearchBar,
  SearchInput,
  SearchIcon,
  LoadingBlock,
  LoadingGif,
  CallContainer,
} from "./styles";
// Imgs //
import logo from "../../assets/logo.png";
import bot from "../../assets/bot.png";
import loadingGif from "../../assets/loading.gif";
// Custom hooks //
import { useInterviewGenerator } from "./hooks/useInterviewGenerator";
// Call Screen //
import CallScreen from "./utilities/callScreen";

const Home = () => {
  // CORS proxy  //
  const corsProxy = import.meta.env.VITE_PROXY_URL as string;
  const {
    url,
    setUrl,
    file,
    setFile,
    extractedText,
    loading,
    error,
    userInput,
    setUserInput,
    handleSubmit,
    handleFileChange,
    handleCancel,
    isCalling,
    handleCalling,
    handleEndCall,
    isGeneratingQuestions,
    questionsGenerated,
    questions,
  } = useInterviewGenerator(corsProxy);

  // File input  //
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Handle input in suggestion bar //
  const handleUserInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };

  return (
    <HeroBlock>
      {loading ? (
        <LoadingBlock>
          <LoadingGif src={loadingGif} alt="Loading..." />
        </LoadingBlock>
      ) : (
        <Container>
          {isCalling ? (
            <CallContainer>
              <CallScreen
                handleEndCall={handleEndCall}
                questions={Array.isArray(questions) ? questions : [questions]}
              />
            </CallContainer>
          ) : (
            <>
              {/* Form */}
              <LeftPanel>
                <Title>Begin a Mock Interview!</Title>
                {extractedText ? (
                  <>
                    <Subtitle>
                      Start your AI-powered mock interview based on the job
                      description. Practice, refine, and excel. Best of luck.
                    </Subtitle>
                    <MockBtnContainer>
                      <StartMockBtn
                        onClick={handleCalling}
                        disabled={isGeneratingQuestions}
                      >
                        {isGeneratingQuestions ? "Preparing..." : "Start"}
                      </StartMockBtn>
                      <StartMockBtn
                        onClick={handleCancel}
                        style={{ backgroundColor: "#FB4141" }}
                      >
                        Cancel
                      </StartMockBtn>
                    </MockBtnContainer>
                    {error && (
                      <Subtitle style={{ color: "red" }}>{error}</Subtitle>
                    )}
                    {questionsGenerated && (
                      <Subtitle style={{ color: "green" }}>
                        Interview questions ready!
                      </Subtitle>
                    )}
                  </>
                ) : (
                  <>
                    <Subtitle>
                      Simply upload an image, PDF, or provide a URL of the job
                      application to start a live interview.
                    </Subtitle>
                    <Form onSubmit={handleSubmit}>
                      <InputGroup>
                        {/* Url */}
                        <Input
                          id="url-input"
                          name="url"
                          type="url"
                          placeholder="Enter application URL here"
                          value={url}
                          onChange={(e) => {
                            setUrl(e.target.value);
                            if (e.target.value) setFile(null);
                          }}
                          disabled={!!file || loading}
                        />
                      </InputGroup>
                      {/* file / img */}
                      <UploadInput
                        ref={fileInputRef}
                        id="file-input"
                        type="file"
                        accept=".jpg, .jpeg, .png, .pdf"
                        onChange={handleFileChange}
                        disabled={!!url || loading}
                      />
                      <UploadButton
                        type="submit"
                        disabled={(!url && !file) || loading}
                      >
                        Upload
                      </UploadButton>
                      {error && (
                        <Subtitle style={{ color: "red" }}>{error}</Subtitle>
                      )}
                    </Form>
                  </>
                )}
              </LeftPanel>
              {/* Assistant */}
              <RightPanel>
                <AssistantContainer>
                  <AvatarImage src={logo} alt="logo" />
                  <UploadTextDisplay>
                    {loading
                      ? "Extracting text..."
                      : extractedText
                      ? extractedText
                      : "Your job requirements details will be displayed here. You can make changes by entering input below or start the interview by typing 'begin'!"}
                  </UploadTextDisplay>
                </AssistantContainer>
                <SearchBar>
                  <SearchIcon src={bot} alt="bot" />
                  <SearchInput
                    id="search-input"
                    type="text"
                    placeholder="Make any adjustments here"
                    value={userInput}
                    onChange={handleUserInputChange}
                  />
                </SearchBar>
              </RightPanel>
            </>
          )}
        </Container>
      )}
    </HeroBlock>
  );
};

export default Home;
