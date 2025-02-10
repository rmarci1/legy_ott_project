import { View, Text } from 'react-native'
import React, { useState } from 'react'

export default function ConvertText({text}) {

    let sections = [];
    if(typeof text == 'string'){
        sections = text.split(/(\*\*\*.*?\*\*\*|\*\*.*?\*\*|\*.*?\*)/).filter(Boolean);
    }
    else if(typeof text == 'object'){
        sections = text;
    }
    console.log(sections);
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

    return (
        <Text>
        {sections.map((section, index) => {
            if (/^\*\*\*.*\*\*\*$/.test(section)) {
                return (
                    <Text key={index} style={{ fontWeight: "bold", fontStyle: "italic" }}>
                        {section.slice(3, -3)}
                    </Text>
                );
            } else if (/^\*\*.*\*\*$/.test(section)) {
                const curr = section.slice(2,-1).split(/(\*\*\*.*?\*\*\*|\*\*.*?\*\*|\*.*?\*)/).filter(Boolean);
                let next = false;
                if(curr != section){
                    next = true
                    console.log(curr);
                }
                return (
                    <Text key={index} style={{ fontWeight: "bold" }}>
                        {!next?section.slice(2, -2): <ConvertText text={curr}></ConvertText>}
                    </Text>
                );
            } else if (/^\*.*\*$/.test(section)) {
                return (
                    <Text key={index} style={{ fontStyle: "italic" }}>
                        {section.slice(1, -1)}
                    </Text>
                );
            }
            else if (section.includes("# ")) {
                const hashCount = section.split("#").length - 1;
                console.log(HashValue(hashCount));
                return (
                    <Text key={index} className={`font-psemibold ${HashValue(hashCount)}`}>
                        {section.replace(/#+/, "").trim()}
                    </Text>
                );
            }
            return <Text key={index}>{section}</Text>;
        })}
    </Text>
    )
}