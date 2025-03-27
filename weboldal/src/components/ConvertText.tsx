export default function ConvertText({ text, isHeader, value }: {text: string  | string[], isHeader?: boolean, value?: number, currentIndex?: number}) {
    let add = false;
    let sections : string[] = [];
    if (typeof text == 'string') {
        sections = text.split(/(^#{1,6}\s+[^#\n]+(?:\n|$))|(\*\*\*[^*]*\*\*\*|\*\*[^*]*\*\*|\*[^*]*\*)/).filter(Boolean);
    }
    else if(typeof text == 'object'){
        sections = text;
    }
    const HashValue = (hash : number) => {
        if (hash <= 1) {
            return "text-2xl";
        } else if (hash <= 2) {
            return "text-xl";
        } else if (hash <= 3) {
            return "text-lg";
        } else if (hash <= 4) {
            return "text-base";
        } else{
            return "text-sm"
        }     
    }
    const getNext = (section: string, slice: number[], add?: string) : [boolean,string[]] => {
        const curr = (section.slice(slice[0],slice[1])+ (add? add : "")).split(/(\*\*\*.*?\*\*\*|\*\*.*?\*\*|\*.*?\*)/).filter(Boolean);
        let next = false;
        if(curr[0] != section.slice(slice[0],slice[1]) || curr.length>1){
            next = true
        }
        return [next,curr];
    }
    return (
        <pre className="text-white break-all whitespace-pre-wrap font-poppins">
        {sections?.map((section, index) => {
            if(!add){
                if (/^\*\*\*.*\*\*\*$/s.test(section)) {
                    let data = [];
                    data = getNext(section, [3, -3]);
                    add = false;
                    return (
                        <span key={index} style={{ fontWeight: "bold", fontStyle: "italic"}} className={`${(isHeader && value)? HashValue(value) : "text-base"} break-words whitespace-pre-line`}>
                            {!data[0]? section.slice(3, -3) : <ConvertText text={data[1]} isHeader={isHeader} value={value}/>}
                        </span>
                    );
                }
                else if (/^\*\*.*\*\*$/s.test(section)) {
                    let data = [];
                    data = getNext(section, [2, -2]);
                    add = false;
                    return (
                        <span key={index} style={{ fontWeight: "bold"}} className={`${(isHeader && value)? HashValue(value!) : "text-base"} break-words whitespace-pre-line`}>
                            {!data[0]? section.slice(2, -2): <ConvertText text={data[1]} isHeader={isHeader} value={value}/>}
                        </span>
                    );         
                } 
                else if (/^\*.*\*$/s.test(section)) {
                    console.log(section);
                    let data = [];
                    data = getNext(section, [1, -1]);
                    add = false;
                    return (
                        <span key={index} style={{ fontStyle: "italic" }} className={`${(isHeader && value)? HashValue(value!) : "text-base"} break-words whitespace-pre-line`}>
                            {!data[0]? section.slice(1, -1): <ConvertText text={data[1]} isHeader={isHeader} value={value}/>}
                        </span>
                    );
                }
                else if (section.includes("# ")) {
                    const hashCount = section.split("#").length - 1;
                    value = hashCount;
                    const line = section.indexOf("\n");
                    if(line != -1){

                    }
                    return (
                        <span key={index} className={`font-psemibold ${HashValue(hashCount)} break-words whitespace-pre-line`}>
                            <ConvertText
                                text={section.replace(/#+/, "").trim().split(/(\*\*\*[^*]*\*\*\*|\*\*[^*]*\*\*|\*[^*]*\*|^#\s*[^#\n]+(?:\n|$))/).filter(Boolean)}
                                isHeader={true}
                                value={value}
                            />
                        </span>
                    );
                }
                return <span key={index} className={`${(isHeader && value)? HashValue(value!) : "text-base"} break-words whitespace-pre-line`}>{section}</span>;
            }

        })}
    </pre>
    )   
}