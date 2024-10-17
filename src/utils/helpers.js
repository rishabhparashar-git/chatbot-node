const extractJsonFromStr = (txt) => {
    // const txt =
    //     'Here is the corrected profile information in JSON format:\n\n```json\n{\n  "fullName": "Rishabh Parashar",\n  "age": 22,\n  "sex": "F"\n}\n```\n\nIf you have any more adjustments or require further assistance, please feel free to let me know.';

    const result = {
        failed: [],
        success: [],
    };

    // approach 1
    const blocks = txt.split("```");
    const codeBlock = blocks[Math.floor(blocks.length / 2)].replace("json", "");
    try {
        const json = JSON.parse(codeBlock);
        console.log("approach1 result", json);
        result.success[0] = json;
    } catch (e) {
        result.failed[0] = "approach1";
    }

    // approach 2
    const txtArr = [...txt];
    const startIndex = txtArr.indexOf("{");
    txtArr.reverse();
    const endIndex = txt.length - txtArr.indexOf("}");

    const slicedStr = txt.slice(startIndex, endIndex);
    try {
        const json = JSON.parse(slicedStr);
        console.log("approach2 result", json);
        result.success[1] = json;
    } catch (e) {
        result.failed[1] = "approach2";
    }

    console.log(result);
};
