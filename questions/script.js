let editor;
require.config({ paths: { vs: "https://unpkg.com/monaco-editor@latest/min/vs" } });
require(["vs/editor/editor.main"], function () {
  editor = monaco.editor.create(document.getElementById("editor"), {
    value: "// Write your code here...",
    language: "java",
    theme: "vs-dark",
    automaticLayout: true
  });
});
document.getElementById("language").addEventListener("change", () => {
  const lang = document.getElementById("language").value;
  const monacoLang = lang === "python" ? "python" : "java";
  monaco.editor.setModelLanguage(editor.getModel(), monacoLang);
});

function toggleInput() 
{
  const checked = document.getElementById("customInputToggle").checked;
  document.getElementById("custom-input").style.display = checked ? "block" : "none";
}

async function runCode() 
{

  const useCustomInput = document.getElementById("customInputToggle").checked;
    
  const customInput = document.getElementById("userInput").value;

  let testInputs = useCustomInput ? [customInput] : inputs;
  let input_op = useCustomInput ? [met(customInput)] : outputs_expected;
  let arr = useCustomInput ? ["a1"] : ["a1", "a2", "a3", "a4", "a5"];

  const langMap = {
    java: 62,
    python: 71,
  };


  const language = document.getElementById("language").value;
  const code = editor.getValue(); // Get code from Monaco

  const outputs = [];
  const outputElement = document.getElementById("output");

  outputElement.textContent = "⏳ Running test cases...";
  let count=0;
  for (let i = 0; i < testInputs.length; i++) 
  {
    const input = testInputs[i];

    const response = await fetch("https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
        // "X-RapidAPI-Key": "af33c10c6bmsh7430b689fd3bb49p1019eejsnba941b82fa1a"
        "X-RapidAPI-Key": "fff0a0e9ddmshad8e36b31b730d7p1a3c37jsnfaee54a86ee2"
      },
      body: JSON.stringify({
        source_code: code,
        language_id: langMap[language],
        stdin: input
      }),
    });

    if (!response.ok) 
    {
      const errorText = await response.text();
      outputs.push(`❌ Error in Testcase ${i + 1}: ${errorText}`);
      continue;
    }

    const result = await response.json();
    const z=input_op[i];
    const output = result.compile_output || result.stderr || result.stdout || "⚠️ Empty or unknown output.";

              
    if(i>2)
    {
      outputs.push(`Hidden Testcase`);
    }
    else
    {
        if (output === result.stdout) 
        {
          outputs.push(`Input:\n${input}\n\nexpected output:\n${z}\n\nyour output:\n${output}`);
        }
        else 
        {
          outputs.push(`Error:\n\n${output}`);
        }
    }
      if((input_op[i])==output.trim())
      {
        document.getElementById(arr[i]).style.backgroundColor="rgb(139, 255, 147)";
        count++;  
      }
      else
      {
        document.getElementById(arr[i]).style.backgroundColor="rgb(255, 118, 118)"; 
      }

  }


  if(testInputs.length==5)
  {
    if(count==5)
    {
      document.getElementById("hii").innerHTML="Accepted";
      document.getElementById("hii").style.color="rgb(0, 255, 0)";
    }
    else
    {
      document.getElementById("hii").innerHTML="Wrong Answer";
      document.getElementById("hii").style.color="red";
    }
  }
  else
  {
    if(count==1)
    {
      document.getElementById("hii").innerHTML="Accepted";
      document.getElementById("hii").style.color="rgb(0, 255, 0)";
    }
    else
    {
      document.getElementById("hii").innerHTML="Wrong Answer";
      document.getElementById("hii").style.color="red";
    }
  }

  // Save all outputs globally for tab selection
  window.testcaseOutputs = outputs;

  // Show first test case output by default
  showTestCase(0);
}

function showTestCase(index) 
{
  const outputElement = document.getElementById("output");
  outputElement.textContent = window.testcaseOutputs?.[index] || "⚠️ Output not available. Please run the code.";
}

function setActive(clickedButton) 
{ 
  document.querySelectorAll("button").forEach(btn => btn.classList.remove("active-btn"));
  clickedButton.classList.add("active-btn");
}
