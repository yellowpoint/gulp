! function(e) {
	"use strict";

	function t(e) {
		for(var t = [0, 1996959894, 3993919788, 2567524794, 124634137, 1886057615, 3915621685, 2657392035, 249268274, 2044508324, 3772115230, 2547177864, 162941995, 2125561021, 3887607047, 2428444049, 498536548, 1789927666, 4089016648, 2227061214, 450548861, 1843258603, 4107580753, 2211677639, 325883990, 1684777152, 4251122042, 2321926636, 335633487, 1661365465, 4195302755, 2366115317, 997073096, 1281953886, 3579855332, 2724688242, 1006888145, 1258607687, 3524101629, 2768942443, 901097722, 1119000684, 3686517206, 2898065728, 853044451, 1172266101, 3705015759, 2882616665, 651767980, 1373503546, 3369554304, 3218104598, 565507253, 1454621731, 3485111705, 3099436303, 671266974, 1594198024, 3322730930, 2970347812, 795835527, 1483230225, 3244367275, 3060149565, 1994146192, 31158534, 2563907772, 4023717930, 1907459465, 112637215, 2680153253, 3904427059, 2013776290, 251722036, 2517215374, 3775830040, 2137656763, 141376813, 2439277719, 3865271297, 1802195444, 476864866, 2238001368, 4066508878, 1812370925, 453092731, 2181625025, 4111451223, 1706088902, 314042704, 2344532202, 4240017532, 1658658271, 366619977, 2362670323, 4224994405, 1303535960, 984961486, 2747007092, 3569037538, 1256170817, 1037604311, 2765210733, 3554079995, 1131014506, 879679996, 2909243462, 3663771856, 1141124467, 855842277, 2852801631, 3708648649, 1342533948, 654459306, 3188396048, 3373015174, 1466479909, 544179635, 3110523913, 3462522015, 1591671054, 702138776, 2966460450, 3352799412, 1504918807, 783551873, 3082640443, 3233442989, 3988292384, 2596254646, 62317068, 1957810842, 3939845945, 2647816111, 81470997, 1943803523, 3814918930, 2489596804, 225274430, 2053790376, 3826175755, 2466906013, 167816743, 2097651377, 4027552580, 2265490386, 503444072, 1762050814, 4150417245, 2154129355, 426522225, 1852507879, 4275313526, 2312317920, 282753626, 1742555852, 4189708143, 2394877945, 397917763, 1622183637, 3604390888, 2714866558, 953729732, 1340076626, 3518719985, 2797360999, 1068828381, 1219638859, 3624741850, 2936675148, 906185462, 1090812512, 3747672003, 2825379669, 829329135, 1181335161, 3412177804, 3160834842, 628085408, 1382605366, 3423369109, 3138078467, 570562233, 1426400815, 3317316542, 2998733608, 733239954, 1555261956, 3268935591, 3050360625, 752459403, 1541320221, 2607071920, 3965973030, 1969922972, 40735498, 2617837225, 3943577151, 1913087877, 83908371, 2512341634, 3803740692, 2075208622, 213261112, 2463272603, 3855990285, 2094854071, 198958881, 2262029012, 4057260610, 1759359992, 534414190, 2176718541, 4139329115, 1873836001, 414664567, 2282248934, 4279200368, 1711684554, 285281116, 2405801727, 4167216745, 1634467795, 376229701, 2685067896, 3608007406, 1308918612, 956543938, 2808555105, 3495958263, 1231636301, 1047427035, 2932959818, 3654703836, 1088359270, 936918e3, 2847714899, 3736837829, 1202900863, 817233897, 3183342108, 3401237130, 1404277552, 615818150, 3134207493, 3453421203, 1423857449, 601450431, 3009837614, 3294710456, 1567103746, 711928724, 3020668471, 3272380065, 1510334235, 755167117], n = -1, o = 0; o < e.length; o++) n = n >>> 8 ^ t[255 & (n ^ e.charCodeAt(o))];
		return(-1 ^ n) >>> 0
	}
	e.crc32s = t
}(this);
var TalkingData = {};
! function(e, t, n) {
	"undefined" != typeof module && module.exports ? module.exports = n() : "function" == typeof define && define.amd ? define(n) : t[e] = n()
}("Fingerprint", TalkingData, function() {
	"use strict";
	var e = function(e) {
		var t, n;
		t = Array.prototype.forEach, n = Array.prototype.map, this.each = function(e, n, o) {
			if(null !== e)
				if(t && e.forEach === t) e.forEach(n, o);
				else if(e.length === +e.length) {
				for(var r = 0, a = e.length; a > r; r++)
					if(n.call(o, e[r], r, e) === {}) return
			} else
				for(var i in e)
					if(e.hasOwnProperty(i) && n.call(o, e[i], i, e) === {}) return
		}, this.map = function(e, t, o) {
			var r = [];
			return null == e ? r : n && e.map === n ? e.map(t, o) : (this.each(e, function(e, n, a) {
				r[r.length] = t.call(o, e, n, a)
			}), r)
		}, "object" == typeof e ? (this.hasher = e.hasher, this.screen_resolution = e.screen_resolution, this.screen_orientation = e.screen_orientation, this.canvas = e.canvas, this.ie_activex = e.ie_activex) : "function" == typeof e && (this.hasher = e)
	};
	return e.prototype = {
		get: function() {
			var e = [];
			if(e.push(navigator.userAgent), e.push(navigator.language), e.push(screen.colorDepth), this.screen_resolution) {
				var t = this.getScreenResolution();
				"undefined" != typeof t && e.push(this.getScreenResolution().join("x"))
			}
			return e.push((new Date).getTimezoneOffset()), e.push(this.hasSessionStorage()), e.push(this.hasLocalStorage()), e.push(!!window.indexedDB), e.push(document.body ? typeof document.body.addBehavior : "undefined"), e.push(typeof window.openDatabase), e.push(navigator.cpuClass), e.push(navigator.platform), e.push(navigator.doNotTrack), e.push(this.getPluginsString()), this.canvas && this.isCanvasSupported() && e.push(this.getCanvasFingerprint()), this.hasher ? this.hasher(e.join("###"), 31) : this.murmurhash3_32_gc(e.join("###"), 31)
		},
		murmurhash3_32_gc: function(e, t) {
			var n, o, r, a, i, s, c, u;
			for(n = 3 & e.length, o = e.length - n, r = t, i = 3432918353, s = 461845907, u = 0; o > u;) c = 255 & e.charCodeAt(u) | (255 & e.charCodeAt(++u)) << 8 | (255 & e.charCodeAt(++u)) << 16 | (255 & e.charCodeAt(++u)) << 24, ++u, c = (65535 & c) * i + (((c >>> 16) * i & 65535) << 16) & 4294967295, c = c << 15 | c >>> 17, c = (65535 & c) * s + (((c >>> 16) * s & 65535) << 16) & 4294967295, r ^= c, r = r << 13 | r >>> 19, a = 5 * (65535 & r) + ((5 * (r >>> 16) & 65535) << 16) & 4294967295, r = (65535 & a) + 27492 + (((a >>> 16) + 58964 & 65535) << 16);
			switch(c = 0, n) {
				case 3:
					c ^= (255 & e.charCodeAt(u + 2)) << 16;
				case 2:
					c ^= (255 & e.charCodeAt(u + 1)) << 8;
				case 1:
					c ^= 255 & e.charCodeAt(u), c = (65535 & c) * i + (((c >>> 16) * i & 65535) << 16) & 4294967295, c = c << 15 | c >>> 17, c = (65535 & c) * s + (((c >>> 16) * s & 65535) << 16) & 4294967295, r ^= c
			}
			return r ^= e.length, r ^= r >>> 16, r = 2246822507 * (65535 & r) + ((2246822507 * (r >>> 16) & 65535) << 16) & 4294967295, r ^= r >>> 13, r = 3266489909 * (65535 & r) + ((3266489909 * (r >>> 16) & 65535) << 16) & 4294967295, r ^= r >>> 16, r >>> 0
		},
		hasLocalStorage: function() {
			try {
				return !!window.localStorage
			} catch(e) {
				return !0
			}
		},
		hasSessionStorage: function() {
			try {
				return !!window.sessionStorage
			} catch(e) {
				return !0
			}
		},
		isCanvasSupported: function() {
			var e = document.createElement("canvas");
			return !(!e.getContext || !e.getContext("2d"))
		},
		isIE: function() {
			return "Microsoft Internet Explorer" === navigator.appName ? !0 : "Netscape" === navigator.appName && /Trident/.test(navigator.userAgent) ? !0 : !1
		},
		getPluginsString: function() {
			return this.isIE() && this.ie_activex ? this.getIEPluginsString() : this.getRegularPluginsString()
		},
		getRegularPluginsString: function() {
			return this.map(navigator.plugins, function(e) {
				var t = this.map(e, function(e) {
					return [e.type, e.suffixes].join("~")
				}).join(",");
				return [e.name, e.description, t].join("::")
			}, this).join(";")
		},
		getIEPluginsString: function() {
			if(window.ActiveXObject) {
				var e = ["ShockwaveFlash.ShockwaveFlash", "AcroPDF.PDF", "PDF.PdfCtrl", "QuickTime.QuickTime", "rmocx.RealPlayer G2 Control", "rmocx.RealPlayer G2 Control.1", "RealPlayer.RealPlayer(tm) ActiveX Control (32-bit)", "RealVideo.RealVideo(tm) ActiveX Control (32-bit)", "RealPlayer", "SWCtl.SWCtl", "WMPlayer.OCX", "AgControl.AgControl", "Skype.Detection"];
				return this.map(e, function(e) {
					try {
						return new ActiveXObject(e), e
					} catch(t) {
						return null
					}
				}).join(";")
			}
			return ""
		},
		getScreenResolution: function() {
			var e;
			return e = this.screen_orientation ? screen.height > screen.width ? [screen.height, screen.width] : [screen.width, screen.height] : [screen.height, screen.width]
		},
		getCanvasFingerprint: function() {
			var e = document.createElement("canvas"),
				t = e.getContext("2d"),
				n = "https://www.talkingdata.com";
			return t.textBaseline = "top", t.font = "14px 'Arial'", t.textBaseline = "alphabetic", t.fillStyle = "#f60", t.fillRect(125, 1, 62, 20), t.fillStyle = "#069", t.fillText(n, 2, 15), t.fillStyle = "rgba(102, 204, 0, 0.7)", t.fillText(n, 4, 17), e.toDataURL()
		}
	}, e
}),
function() {
	"use strict";
	window.neumedias = window.neumedias || {}, neumedias.platform = function() {
		var e = window.navigator.userAgent,
			t = window.navigator.platform,
			n = {};
		return t.match(/win32/gi) ? (n.os = "windows", e.match(/windows\s+nt\s+5\.1/gi) ? (n.type = "desktop", n.code = "xp") : e.match(/windows\s+nt\s+6\.0/gi) ? (n.type = "desktop", n.code = "vista") : e.match(/windows\s+nt\s+6\.1/gi) ? (n.type = "desktop", n.code = "7") : e.match(/windows\s+nt\s+6\.2/gi) ? (n.type = "desktop", n.code = "8") : e.match(/windows\s+nt\s+6\.3/gi) ? (n.type = "desktop", n.code = "8.1") : e.match(/windows\s+phone\s+7/gi) ? (n.type = "phone", n.code = "7") : e.match(/windows\s+phone\s+8/gi) && (n.type = "phone", n.code = "8")) : t.match(/macintel/gi) ? n.os = "macosx" : t.match(/iphone/gi) ? (n.os = "ios", n.type = "phone", n.code = "8") : t.match(/ipad/gi) ? (n.os = "ios", n.type = "tablet", n.code = "8") : t.match(/linux/gi) && (e.match(/android/gi) ? (n.os = "android", n.type = "mobile") : e.match(/cros/gi) ? (n.os = "chromeos", n.type = "desktop") : e.match(/ubuntu/gi) ? (n.os = "ubuntu", n.type = "desktop") : (n.os = "linux", n.type = "desktop")), n
	}, neumedias.isIOS = function() {
		return "ios" == neumedias.platform().os
	}, neumedias.isAndroid = function() {
		return "android" == neumedias.platform().os
	}, neumedias.isMobile = function() {
		var e = neumedias.platform();
		return "mobile" == e.type || "phone" == e.type || "tablet" == e.type
	}
}(),
function(e) {
	if("function" == typeof define && define.amd) define(e);
	else if("object" == typeof exports) module.exports = e();
	else {
		var t = window.Cookies,
			n = window.Cookies = e();
		n.noConflict = function() {
			return window.Cookies = t, n
		}
	}
}(function() {
	function e() {
		for(var e = 0, t = {}; e < arguments.length; e++) {
			var n = arguments[e];
			for(var o in n) t[o] = n[o]
		}
		return t
	}

	function t(n) {
		function o(t, r, a) {
			var i;
			if(arguments.length > 1) {
				if(a = e({
						path: "/"
					}, o.defaults, a), "number" == typeof a.expires) {
					var s = new Date;
					s.setMilliseconds(s.getMilliseconds() + 864e5 * a.expires), a.expires = s
				}
				try {
					i = JSON.stringify(r), /^[\{\[]/.test(i) && (r = i)
				} catch(c) {}
				return r = n.write ? n.write(r, t) : encodeURIComponent(String(r)).replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent), t = encodeURIComponent(String(t)), t = t.replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent), t = t.replace(/[\(\)]/g, escape), document.cookie = [t, "=", r, a.expires && "; expires=" + a.expires.toUTCString(), a.path && "; path=" + a.path, a.domain && "; domain=" + a.domain, a.secure ? "; secure" : ""].join("")
			}
			t || (i = {});
			for(var u = document.cookie ? document.cookie.split("; ") : [], l = /(%[0-9A-Z]{2})+/g, d = 0; d < u.length; d++) {
				var p = u[d].split("="),
					f = p[0].replace(l, decodeURIComponent),
					g = p.slice(1).join("=");
				'"' === g.charAt(0) && (g = g.slice(1, -1));
				try {
					if(g = n.read ? n.read(g, f) : n(g, f) || g.replace(l, decodeURIComponent), this.json) try {
						g = JSON.parse(g)
					} catch(c) {}
					if(t === f) {
						i = g;
						break
					}
					t || (i[f] = g)
				} catch(c) {}
			}
			return i
		}
		return o.get = o.set = o, o.getJSON = function() {
			return o.apply({
				json: !0
			}, [].slice.call(arguments))
		}, o.defaults = {}, o.remove = function(t, n) {
			o(t, "", e(n, {
				expires: -1
			}))
		}, o.withConverter = t, o
	}
	return t(function() {})
}),
function(e) {
	window.TDSAVE = window.TDSAVE || {}, TDSAVE = e(Cookies)
}(function(e) {
	var t = {};
	return t.mark = "__TD_TK_", t.localStorage = {
		set: function(n, o) {
			return window.localStorage ? void this.addLocalStorage(n, o) : void("sessionId" != n && e.set(t.mark + n, o))
		},
		get: function(n) {
			if(!window.localStorage) return e.get(t.mark + n);
			var o = this.getLocalStorage(n);
			return o ? o : void 0
		},
		del: function(n) {
			window.localStorage || e.remove(t.mark + n), this.delLocalStorage(n)
		},
		addLocalStorage: function(e, n) {
			if("sessionId" == e && window.sessionStorage) sessionStorage.setItem(t.mark + e, n);
			else try {
				localStorage[t.mark + e] = n
			} catch(o) {
				"QuotaExceededError" === o.name && console.error("超出大小！")
			} finally {}
		},
		delLocalStorage: function(e) {
			window.localStorage && localStorage.removeItem(t.mark + e)
		},
		getLocalStorage: function(e) {
			return window.localStorage ? "sessionId" == e && window.sessionStorage ? sessionStorage.getItem(t.mark + e) : localStorage[t.mark + e] : void 0
		}
	}, t.sessionStorage = {
		set: function(e, n) {
			window.sessionStorage && sessionStorage.setItem(t.mark + e, n)
		},
		get: function(e) {
			return window.sessionStorage ? sessionStorage.getItem(t.mark + e) : void 0
		},
		remove: function(e) {
			window.sessionStorage && sessionStorage.removeItem(t.mark + e)
		}
	}, t
});
var $$ = function(e) {
	function t() {
		return !0
	}

	function n(e, n, o, r) {
		return e.global ? t(n || A, o, r) : void 0
	}

	function o(e) {
		e.global && 0 === C.active++ && n(e, null, "ajaxStart")
	}

	function r(e) {
		e.global && !--C.active && n(e, null, "ajaxStop")
	}

	function a(e, t) {
		var o = t.context;
		return t.beforeSend.call(o, e, t) === !1 || n(t, o, "ajaxBeforeSend", [e, t]) === !1 ? !1 : void n(t, o, "ajaxSend", [e, t])
	}

	function i(e, t, o) {
		var r = o.context,
			a = "success";
		o.success.call(r, e, a, t), n(o, r, "ajaxSuccess", [t, o, e]), c(a, t, o)
	}

	function s(e, t, o, r) {
		var a = r.context;
		r.error.call(a, o, t, e), n(r, a, "ajaxError", [o, r, e]), c(t, o, r)
	}

	function c(e, t, o) {
		var a = o.context;
		o.complete.call(a, t, e), n(o, a, "ajaxComplete", [t, o]), r(o)
	}

	function u() {}

	function l(e) {
		return e && (e == R ? "html" : e == E ? "json" : S.test(e) ? "script" : w.test(e) && "xml") || "text"
	}

	function d(e, t) {
		return(e + "&" + t).replace(/[&?]{1,2}/, "?")
	}

	function p(e) {
		"object" == typeof e.data && (e.data = g(e.data)), !e.data || e.type && "GET" != e.type.toUpperCase() || (e.url = d(e.url, e.data))
	}

	function f(e, t, n, o) {
		var r = "array" == typeof t;
		for(var a in t) {
			var i = t[a];
			o && (a = n ? o : o + "[" + (r ? "" : a) + "]"), !o && r ? e.add(i.name, i.value) : (n ? "array" == typeof i : "object" == typeof i) ? f(e, i, n, a) : e.add(a, i)
		}
	}

	function g(e, t) {
		var n = [];
		return n.add = function(e, t) {
			this.push(I(e) + "=" + I(t))
		}, f(n, e, t), n.join("&").replace("%20", "+")
	}

	function m(e) {
		var t = Array.prototype.slice;
		return t.call(arguments, 1).forEach(function(t) {
			for(h in t) void 0 !== t[h] && (e[h] = t[h])
		}), e
	}
	var h, v, T = 0,
		A = e.document,
		S = /^(?:text|application)\/javascript/i,
		w = /^(?:text|application)\/xml/i,
		E = "application/json",
		R = "text/html",
		y = /^\s*$/,
		C = function(t) {
			var n = m({}, t || {});
			for(h in C.settings) void 0 === n[h] && (n[h] = C.settings[h]);
			o(n), n.crossDomain || (n.crossDomain = /^([\w-]+:)?\/\/([^\/]+)/.test(n.url) && RegExp.$2 != e.location.host);
			var r = n.dataType,
				c = /=\?/.test(n.url);
			if("jsonp" == r || c) return c || (n.url = d(n.url, "callback=?")), C.JSONP(n);
			n.url || (n.url = e.location.toString()), p(n);
			var f, g = n.accepts[r],
				T = {},
				A = /^([\w-]+:)\/\//.test(n.url) ? RegExp.$1 : e.location.protocol,
				S = C.settings.xhr();
			n.crossDomain || (T["X-Requested-With"] = "XMLHttpRequest"), g && (T.Accept = g, g.indexOf(",") > -1 && (g = g.split(",", 2)[0]), S.overrideMimeType && S.overrideMimeType(g)), (n.contentType || n.data && "GET" != n.type.toUpperCase()) && (T["Content-Type"] = n.contentType || "application/x-www-form-urlencoded"), n.headers = m(T, n.headers || {}), S.onreadystatechange = function() {
				if(4 == S.readyState) {
					clearTimeout(f);
					var e, t = !1;
					if(S.status >= 200 && S.status < 300 || 304 == S.status || 0 == S.status && "file:" == A) {
						r = r || l(S.getResponseHeader("content-type")), e = S.responseText;
						try {
							"script" == r ? (1, eval)(e) : "xml" == r ? e = S.responseXML : "json" == r && (e = y.test(e) ? null : JSON.parse(e))
						} catch(o) {
							t = o
						}
						t ? s(t, "parsererror", S, n) : i(e, S, n)
					} else s(null, "error", S, n)
				}
			};
			var w = "async" in n ? n.async : !0;
			S.open(n.type, n.url, w);
			for(v in n.headers) S.setRequestHeader(v, n.headers[v]);
			return a(S, n) === !1 ? (S.abort(), !1) : (n.timeout > 0 && (f = setTimeout(function() {
				S.onreadystatechange = u, S.abort(), s(null, "timeout", S, n)
			}, n.timeout)), S.send(n.data ? n.data : null), S)
		};
	C.active = 0, C.JSONP = function(t) {
		if(!("type" in t)) return C(t);
		var n, o = "jsonp" + ++T,
			r = A.createElement("script"),
			a = function() {
				o in e && (e[o] = u), c("abort", s, t)
			},
			s = {
				abort: a
			},
			l = A.getElementsByTagName("head")[0] || A.documentElement;
		return t.error && (r.onerror = function() {
			s.abort(), t.error()
		}), e[o] = function(r) {
			clearTimeout(n), delete e[o], i(r, s, t)
		}, p(t), r.src = t.url.replace(/=\?/, "=" + o), l.insertBefore(r, l.firstChild), t.timeout > 0 && (n = setTimeout(function() {
			s.abort(), c("timeout", s, t)
		}, t.timeout)), s
	}, C.settings = {
		type: "GET",
		beforeSend: u,
		success: u,
		error: u,
		complete: u,
		context: null,
		global: !0,
		xhr: function() {
			return new e.XMLHttpRequest
		},
		accepts: {
			script: "text/javascript, application/javascript",
			json: E,
			xml: "application/xml, text/xml",
			html: R,
			text: "text/plain"
		},
		crossDomain: !1,
		timeout: 0
	}, C.get = function(e, t) {
		return C({
			url: e,
			success: t
		})
	}, C.post = function(e, t, n, o) {
		return "function" == typeof t && (o = o || n, n = t, t = null), C({
			type: "POST",
			url: e,
			data: t,
			success: n,
			dataType: o
		})
	}, C.getJSON = function(e, t) {
		return C({
			url: e,
			success: t,
			dataType: "json"
		})
	};
	var I = encodeURIComponent;
	return {
		ajax: C
	}
}(window);
! function() {
	"use strict";

	function e(e) {
		this.type = e.type || "GET", this.url = e.url
	}
	e.prototype = {
		getAjax: function(e) {
			var t = this;
			if(navigator.userAgent.indexOf("MSIE 9.0") > 0) {
				var n = navigator.appVersion.split(";")[1].replace(/[ ]/g, "");
				if("MSIE6.0" == n || "MSIE7.0" == n) return void alert("no support IE6,IE7");
				if(window.XDomainRequest) {
					var o = new XDomainRequest;
					o ? (e.error && "function" == typeof e.error && (o.onerror = function() {
						e.error()
					}), e.timeout && "function" == typeof e.timeout && (o.ontimeout = function() {
						e.timeout()
					}), e.success && "function" == typeof e.success && (o.onload = function() {
						e.dataType ? "json" == e.dataType.toLowerCase() && e.success(JSON.parse(o.responseText)) : e.success(o.responseText)
					}), o.open(t.type, t.url), o.send(e.data)) : alert("Failed to create XDomainRequest")
				}
			} else $$.ajax({
				type: this.type,
				url: e.url,
				data: e.data,
				dataType: "text",
				success: e.success,
				error: e.error
			})
		},
		set: function(e, t, n) {
			this.send(e, t, n)
		},
		send: function(e, t, n) {
			var o = this,
				r = JSON.stringify(e),
				a = crc32s(r).toString(16);
			this.getAjax({
				url: o.url + "/" + a + "/1",
				data: r,
				success: t,
				error: n
			})
		}
	}, window.TdUrlRequest = e
}(),
function() {
	var e = function(e) {
		var t = e || window.location.search,
			n = {};
		if(t.indexOf("?") > -1) {
			t = t.substr(1);
			for(var o = t.split("&"), r = 0, a = o.length; a > r; r++) {
				var i = o[r],
					s = i.indexOf("=");
				if(s > 0) {
					var c = i.substr(0, s),
						u = i.substr(s + 1);
					n[c] = u
				}
			}
		}
		return n
	};
	window.TRACK_PRIVATE = {}, TRACK_PRIVATE.topics = {}, TRACK_PRIVATE.subUid = -1;
	var t = new Date,
		n = TDSAVE.localStorage.get("td_ref_time"),
		o = t.getFullYear() + "-" + (t.getMonth() + 1) + "-" + t.getDay(),
		r = TDSAVE.localStorage.get("td_ref") || "";
	if(n && n === o) TRACK_PRIVATE.referrer = r;
	else {
		var a = new Date,
			i = a.getFullYear() + "-" + (a.getMonth() + 1) + "-" + a.getDay();
		TDSAVE.localStorage.set("td_ref_time", i);
		var s = encodeURIComponent(decodeURIComponent(e().td_ref)) || "";
		TRACK_PRIVATE.referrer = s, TDSAVE.localStorage.set("td_ref", s)
	}
	TRACK_PRIVATE.init = function(e) {
		e && "function" == typeof e && e()
	}, TRACK_PRIVATE.cloneEventObj = function(e, t) {
		var n, o = Object.prototype.toString,
			r = "[object Array]",
			a = t || {};
		for(n in e) e.hasOwnProperty(n) && ("object" == typeof e[n] ? (a[n] = o.call(e[n]) === r ? [] : {}, TRACK_PRIVATE.cloneEventObj(e[n], a[n])) : a[n] = e[n]);
		return a
	}, TRACK_PRIVATE.installEventObj = function(e) {
		var t = this.cloneEventObj(TRACKINGSDK.Event);
		t.action = e, t.ts = Date.now(), t.action.data.referrer = TRACK_PRIVATE.referrer, t.action.data.UA = navigator.userAgent || "", TRACK_PRIVATE.publish("pushEvent", t)
	}, TRACK_PRIVATE.publish = function(e, t) {
		return TRACK_PRIVATE.topics[e] ? (setTimeout(function() {
			for(var n = TRACK_PRIVATE.topics[e], o = n ? n.length : 0; o--;) n[o].func(e, t)
		}, 0), !0) : !1
	}, TRACK_PRIVATE.subsrcibe = function(e, t) {
		TRACK_PRIVATE.topics[e] || (TRACK_PRIVATE.topics[e] = []);
		var n = (++TRACK_PRIVATE.subUid).toString();
		return TRACK_PRIVATE.topics[e].push({
			token: n,
			func: t
		}), n
	}, TRACK_PRIVATE.unsubscribe = function(e) {
		for(var t in TRACK_PRIVATE.topics)
			if(TRACK_PRIVATE.topics[t])
				for(var n = TRACK_PRIVATE.topics[t], o = 0, r = n.length; r > o; o++)
					if(n[o].token === e) return TRACK_PRIVATE.topics[t].splice(o, 1), e;
		return !1
	};
	try {
		window.TD_FIRE && "function" == typeof window.TD_FIRE && window.TD_FIRE()
	} catch(c) {}
}(),
function() {
	"use strict";
	var e = {
			getArgs: function(e) {
				for(var t = new Object, n = e || window.location.search.substring(1), o = n.split("&"), r = 0; r < o.length; r++) {
					var a = o[r].indexOf("=");
					if(-1 != a) {
						var i = o[r].substring(0, a),
							s = o[r].substring(a + 1);
						s = decodeURIComponent(s), t[i] = s
					}
				}
				return t
			},
			getDeviceId: function() {
				var e = new TalkingData.Fingerprint,
					t = new TalkingData.Fingerprint({
						screen_resolution: !0
					}),
					n = e.get() + "" + t.get();
				return n.replace(/\.|\+|\(|\)/g, "")
			},
			getRandom: function() {
				var e = (new Date).getTime().toString();
				return e.substr(6)
			},
			getScreeParam: function(e) {
				var t = this.getArgs(),
					n = [];
				for(var o in t)
					if(o.indexOf(e) > -1) {
						if(o.indexOf("_") > -1) {
							n.push(o.split("_")[1] + "|" + t[o]);
							continue
						}
						n.push(t[o])
					}
				return n
			},
			getAppMsg: function() {
				var e = document.getElementById("td_tracking_sdk");
				if(!e) return "";
				var t = e.getAttribute("src").split("?");
				if(t[1] && t[1].indexOf("=") > -1) {
					var n = this.getArgs(t[1]).ak;
					if(n) return n
				}
				return ""
			},
			on: function(e, t, n) {
				e.addEventListener ? e.addEventListener(t, n, !1) : e.attachEvent ? e.attachEvent("on" + t, n) : e["on" + t] = n
			},
			getDuration: function() {
				var t = TDSAVE.localStorage.get("exit"),
					n = TDSAVE.localStorage.get("sessionid"),
					o = e.getSessionId();
				return o && n && o != n ? Date.now() - parseInt(t) : "0"
			},
			getSessionId: function(e) {
				var t = TDSAVE.sessionStorage.get("sessionid");
				return t ? TDSAVE.localStorage.set("sessionid", t) : (TDSAVE.sessionStorage.set("sessionid", e), t = e), TDSAVE.sessionStorage.get("sessionid")
			}
		},
		t = e.getArgs(),
		n = e.getDeviceId(),
		o = e.getSessionId(n + e.getRandom()),
		r = neumedias.isIOS(),
		a = neumedias.isAndroid();
	TDSAVE.localStorage.get("installTime") || TDSAVE.localStorage.set("installTime", JSON.stringify((new Date).getTime()));
	var i = {
		device: {
			deviceId: {
				tid: n,
				imeis: t.muid || "",
				wifiMacs: e.getScreeParam("mac"),
				androidId: a ? e.getScreeParam("androidid") : "",
				adId: a ? e.getScreeParam("advertisingid") : r ? e.getScreeParam("idfa") : []
			},
			DeviceSoftwareConfig: {
				os: t.devicetype || (r ? "ios" : a ? "android" : ""),
				osVersionName: t.osversion || "",
				timezone: (new Date).getTimezoneOffset() / 60 * -1,
				language: navigator.language
			}
		},
		app: {
			appKey: e.getAppMsg(),
			channel: "",
			versionName: "1.0.0",
			versionCode: "1.0.0",
			installTime: TDSAVE.localStorage.get("installTime") || 0
		},
		appContext: {
			sessionId: o,
			page: location.href,
			campaignid: t.campaignid || "",
			cookie: document.cookie
		},
		sdk: {
			version: "1",
			minorVersion: "1",
			build: "1",
			platform: "html5"
		}
	};
	e.on(window, "pagehide", function() {
		TDSAVE.localStorage.set("exit", Date.now())
	}), e.on(window, "beforeunload", function() {
		TDSAVE.localStorage.set("exit", Date.now())
	}), window.TRACKINGSDK = {
		Event: i,
		TD: e
	}; {
		var s = new TdUrlRequest({
			type: "POST",
			url: TDRequestUrl
		});
		TRACK_PRIVATE.subsrcibe("pushEvent", function(e, t) {
			var n = [t],
				o = TDSAVE.localStorage.get("Events");
			if(o) {
				var r = JSON.parse(o);
				r instanceof Array && (n = n.concat(r), TDSAVE.localStorage.del("Events"))
			}
			s.set(n, function() {}, function() {
				var e = TDSAVE.localStorage.get("Events");
				if(e) {
					var t = JSON.parse(e);
					if(t instanceof Array) {
						var o = n.concat(t);
						TDSAVE.localStorage.set("Events", JSON.stringify(o))
					}
				} else TDSAVE.localStorage.set("Events", JSON.stringify(n))
			})
		})
	}
}(),
function(e) {
	"use strict";

	function t(e, t, n, o, r, a) {
		var i = {
			domain: "account",
			name: "register",
			data: {
				accountId: e || "",
				name: t || "",
				age: n || "",
				gender: o || "",
				type: r || "",
				custom: a || ""
			}
		};
		TRACK_PRIVATE.installEventObj(i)
	}

	function n(e, t, n, o, r, a) {
		var i = {
			domain: "account",
			name: "login",
			data: {
				accountId: e || "",
				name: t || "",
				age: n || "",
				gender: o || "",
				type: r || "",
				custom: a || ""
			}
		};
		TRACK_PRIVATE.installEventObj(i)
	}

	function o(e, t) {
		var n = {
			domain: "ad",
			name: "download",
			data: {
				url: e || "",
				tag: t || ""
			}
		};
		if(TRACK_PRIVATE.installEventObj(n), e) {
			var o = decodeURIComponent(TRACK_PRIVATE.referrer).toString(),
				r = o.lastIndexOf("?") > -1 ? o.substring(o.lastIndexOf("?"), o.length) : "";
			o && (e += e.toString().indexOf("?") > -1 ? "&" + r : "?" + r), e.toString().indexOf("https://lnk0.com/") > -1 && setTimeout(function() {
				window.location.href = e
			}, 1e3)
		}
	}

	function r(e) {
		var t = {
			domain: "iap",
			name: "viewItem",
			data: {
				item: e || ""
			}
		};
		TRACK_PRIVATE.installEventObj(t)
	}

	function a(e) {
		var t = {
			domain: "iap",
			name: "viewItems",
			data: {
				item: e || ""
			}
		};
		TRACK_PRIVATE.installEventObj(t)
	}

	function i(e) {
		var t = {
			domain: "iap",
			name: "addItem",
			data: {
				item: e || ""
			}
		};
		TRACK_PRIVATE.installEventObj(t)
	}

	function s(e, t, n, o) {
		var r = {
			domain: "iap",
			name: "placeOrder",
			data: {
				orderId: e || "",
				amount: t || "",
				currencyType: n || "",
				items: o || ""
			}
		};
		TRACK_PRIVATE.installEventObj(r)
	}

	function c(e, t) {
		var n = {
			domain: "session",
			name: "begin",
			data: {
				sessionId: e || "",
				interval: t || ""
			}
		};
		TRACK_PRIVATE.installEventObj(n)
	}

	function u(e, t) {
		var n = {
			domain: "session",
			name: "end",
			data: {
				sessionId: e || "",
				duration: t || ""
			}
		};
		TRACK_PRIVATE.installEventObj(n)
	}

	function l(e, t, n) {
		var o = {
			domain: "page",
			name: "enter",
			data: {
				name: e || "",
				title: t || "",
				from: n || ""
			}
		};
		TRACK_PRIVATE.installEventObj(o)
	}

	function d(e, t) {
		var n = {
			domain: "page",
			name: "enter",
			data: {
				name: e || "",
				duration: t || 0
			}
		};
		TRACK_PRIVATE.installEventObj(n)
	}

	function p(e, t) {
		var n = {
			domain: "account",
			name: "roleCreate",
			data: {
				name: e || "",
				custom: t || 0
			}
		};
		TRACK_PRIVATE.installEventObj(n)
	}

	function f(e, t, n, o, r, a) {
		var i = {
			domain: "iap",
			name: "currencyPurchase",
			data: {
				orderId: e || "",
				amount: t || 0,
				currencyType: n || "CNY",
				payType: o || "",
				itemId: r || "",
				itemCount: a || ""
			}
		};
		TRACK_PRIVATE.installEventObj(i)
	}
	e.TRACK = {
		account: {
			register: t,
			login: n,
			roleCreate: p
		},
		ad: {
			download: o
		},
		iap: {
			viewItem: r,
			viewItems: a,
			addItem: i,
			placeOrder: s,
			currencyPurchase: f
		},
		session: {
			begin: c,
			end: u
		},
		page: {
			enter: l,
			leave: d
		}
	}, TRACK_PRIVATE.init(function() {
		{
			var t = TDSAVE.sessionStorage.get("sessionid"),
				n = e.TD.getDuration();
			Date.now()
		}
		t && "0" != t && c(t, n), setInterval(function() {
			u(t, 5e3)
		}, 5e3), l(document.title || "", document.title || "", TRACK_PRIVATE.referrer)
	}), window.TDH5SDK = e.TRACK
}(TRACKINGSDK);