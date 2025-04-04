import { View, Text } from 'react-native'
import React, { useState } from 'react'

export default function ConvertText({ text, isHeader, value }) {
    let add = false;
    let sections = [];
    if(typeof text == 'string'){
        sections= text.split(/(\*\*\*[^\s*].*?[^\s*]\*\*\*|\*\*[^\s*].*?[^\s*]\*\*|\*[^\s*].*?[^\s*]\*|(?<=^#\s*[^#\n]+)\n)/m).filter(Boolean);
    }
    else if(typeof text == 'object'){
        sections = text;
    }

    const HashValue = (hash) => {
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
    const getNext = (section, slice, add) => {
        const curr = (section.slice(slice[0],slice[1])+ (add? add : "")).split(/(\*\*\*.*?\*\*\*|\*\*.*?\*\*|\*.*?\*)/).filter(Boolean);
        let next = false;
        if(curr[0] != section.slice(slice[0],slice[1]) || curr.length>1){
            next = true
        }
        return [next,curr];
    }
    return (
        <Text>
        {sections?.map((section, index) => {
            if(!add){
                const contains = section.indexOf("n");
                if(contains != -1) isHeader = false;

                if (/^\*\*\*.*\*\*\*$/.test(section)) {
                    let data = [];
                    if(index+1<sections.length && section[index+1].includes("*")){
                        data = getNext(section, [3, -3], sections[index+1]);
                        add = true;
                    }
                    else{
                        data = getNext(section, [3, -3]);
                        add = false;
                    }
                    return (
                        <Text key={index} style={{ fontWeight: "bold", fontStyle: "italic"}} className={`${isHeader? HashValue(value) : "text-base"}`}>
                            {!data[0]? section.slice(3, -3) : <ConvertText text={data[1]} isHeader={isHeader} value={value}/>}
                        </Text>
                    );
                }
                else if (/^\*\*.*\*\*$/.test(section)) {
                    let data = [];
                    if(index+1<sections.length && !/^\*\*\*.*\*\*\*$/.test(sections[index+1]) && !/^\*.*\*$/.test(sections[index+1]) && sections[index+1].includes('*')){
                        data = getNext(section, [2, -2], sections[index+1]);
                        add = true;
                    }
                    else{
                        data = getNext(section, [2, -2]);
                        add = false;
                    }
                    return (
                        <Text key={index} style={{ fontWeight: "bold"}} className={`${isHeader? HashValue(value) : "text-base"}`}>
                            {!data[0]? section.slice(2, -2): <ConvertText text={data[1]} isHeader={isHeader} value={value}/>}
                        </Text>
                    );         
                } 
                else if (/^\*.*\*$/.test(section)) {
                    let data = [];
                    if(index+1<sections.length && section[index+1].includes("*")){
                        data = getNext(section, [1, -1],add);
                        add = true;
                    }
                    else{
                        data = getNext(section, [1, -1]);
                        add = false;
                    }
                    return (
                        <Text key={index} style={{ fontStyle: "italic" }} className={`${isHeader? HashValue(value) : "text-base"}`}>
                            {!data[0]? section.slice(1, -1): <ConvertText text={data[1]} isHeader={isHeader} value={value}/>}
                        </Text>
                    );
                }
                else if (section.includes("# ")) {
                    const hashCount = section.split("#").length - 1;
                    const index = section.indexOf(/\n/);
                    isHeader = true;
                    value = hashCount;
                    return (
                        <Text key={index} className={`font-psemibold ${HashValue(hashCount)}`}>
                            {section.replace(/#+/, "").trim()}
                        </Text>
                    );
                }
                return <Text key={index} className={`${isHeader? HashValue(value) : "text-base"}`}>{section}</Text>;
            }

        })}
    </Text>
    )
}