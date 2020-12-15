export default `
precision highp float;
precision highp int;
precision highp sampler2D;

#include common

uniform sampler2D tDepth;

uniform vec3 uSamples[dNSamples];

uniform mat4 uProjection;
uniform mat4 uInvProjection;

uniform vec2 uTexSize;

uniform float uRadius;
uniform float uBias;

float smootherstep(float edge0, float edge1, float x) {
	x = clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0);
	return x * x * x * (x * (x * 6.0 - 15.0) + 10.0);
}

float noise(const in vec2 coords) {
	float a = 12.9898;
	float b = 78.233;
	float c = 43758.5453;
	float dt = dot(coords, vec2(a,b));
	float sn = mod(dt, 3.14159);
	return abs(fract(sin(sn) * c)); // is abs necessary?
}

vec2 getNoiseVec2(const in vec2 coords) {
	return vec2(noise(coords), noise(coords) + 2.71828);
}

bool isBackground(const in float depth) {
    return depth >= 0.99;
}

float getDepth(const in vec2 coords) {
	return unpackRGBAToDepth(texture2D(tDepth, coords));
}

vec3 normalFromDepth(const in float depth, const in float depth1, const in float depth2, vec2 offset1, vec2 offset2) {
    vec3 p1 = vec3(offset1, depth1 - depth);
    vec3 p2 = vec3(offset2, depth2 - depth);
    
    vec3 normal = cross(p1, p2);
    normal.z = -normal.z;
    
    return normalize(normal);
}

void main(void) {
	vec2 selfCoords = gl_FragCoord.xy / uTexSize;

	float selfDepth = getDepth(selfCoords);
	vec2 selfPackedDepth = packUnitIntervalToRG(selfDepth);

	if (isBackground(selfDepth)) {
		gl_FragColor = vec4(packUnitIntervalToRG(0.0), selfPackedDepth);
		return;
	}
	
	vec2 offset1 = vec2(0.0, 0.001);
    vec2 offset2 = vec2(0.001, 0.0);

	float selfDepth1 = getDepth(selfCoords + offset1);
	float selfDepth2 = getDepth(selfCoords + offset2);

	vec3 selfViewNormal = normalFromDepth(selfDepth, selfDepth1, selfDepth2, offset1, offset2);
	vec3 selfViewPos = screenSpaceToViewSpace(vec3(selfCoords, selfDepth), uInvProjection);

    vec3 randomVec = normalize(vec3(getNoiseVec2(selfCoords) * 2.0 - 1.0, 0.0));
	
    vec3 tangent = normalize(randomVec - selfViewNormal * dot(randomVec, selfViewNormal));
    vec3 bitangent = cross(selfViewNormal, tangent);
    mat3 TBN = mat3(tangent, bitangent, selfViewNormal);

    float occlusion = 0.0;
    for(int i = 0; i < dNSamples; i++){
        vec3 sampleViewPos = TBN * uSamples[i];
        sampleViewPos = selfViewPos + sampleViewPos * uRadius; 
        
        vec4 offset = vec4(sampleViewPos, 1.0);
        offset = uProjection * offset;
        offset.xyz /= offset.w;
        offset.xyz = offset.xyz * 0.5 + 0.5;
        
		float sampleDepth = getDepth(offset.xy);
		float sampleViewZ = screenSpaceToViewSpace(vec3(offset.xy, sampleDepth), uInvProjection).z;

        occlusion += (sampleViewZ >= sampleViewPos.z + uBias ? 1.0 : 0.0) * smootherstep(0.0, 1.0, uRadius / abs(selfViewPos.z - sampleViewZ));           
    }
    occlusion = 1.0 - (occlusion / float(dNSamples));

	vec2 packedOcclusion = packUnitIntervalToRG(occlusion);
    
    gl_FragColor = vec4(packedOcclusion, selfPackedDepth);
}
`;